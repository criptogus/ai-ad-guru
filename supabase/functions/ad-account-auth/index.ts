import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { storeTokens, revokeTokens } from "./utils/token.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { getGoogleAuthUrl, exchangeGoogleToken, verifyGoogleAdsAccess } from "./platforms/google.ts";
import { getLinkedInAuthUrl, exchangeLinkedInToken } from "./platforms/linkedin.ts";

// Create a Supabase client with the Auth context
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { action, platform, redirectUri, code, state, userId } = body;

    console.log(`Processing ${action} for ${platform} account${userId ? ', user: ' + userId : ''}`);

    // Validation
    if (!action) {
      throw new Error('Action is required');
    }
    
    if (!platform) {
      throw new Error('Platform is required');
    }

    // Route the request based on the action
    if (action === 'getAuthUrl') {
      if (!redirectUri) {
        throw new Error('Redirect URI is required');
      }

      let authUrl;
      const secureState = crypto.randomUUID();
      
      // Generate platform-specific auth URL
      if (platform === 'google') {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) {
          throw new Error('Missing required Google API credentials');
        }
        authUrl = getGoogleAuthUrl(clientId, redirectUri, secureState);
      } 
      else if (platform === 'linkedin') {
        const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        if (!clientId) {
          throw new Error('Missing required LinkedIn API credentials');
        }
        authUrl = getLinkedInAuthUrl(clientId, redirectUri, secureState);
      }
      else {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      // Store OAuth state in database for verification during callback
      if (userId) {
        const { error } = await supabase
          .from('oauth_states')
          .insert({
            id: secureState,
            user_id: userId,
            platform,
            redirect_uri: redirectUri,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
          });
          
        if (error) {
          console.error('Error storing OAuth state:', error);
        }
      }

      // Return the authorization URL
      return new Response(
        JSON.stringify({ success: true, authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'exchangeToken') {
      if (!code) {
        throw new Error('Authorization code is required');
      }
      
      if (!redirectUri) {
        throw new Error('Redirect URI is required');
      }

      if (!state) {
        throw new Error('State parameter is required');
      }

      // Verify OAuth state from database
      const { data: oauthState, error: stateError } = await supabase
        .from('oauth_states')
        .select('*')
        .eq('id', state)
        .maybeSingle();
      
      if (stateError) {
        console.error('Error verifying OAuth state:', stateError);
        throw new Error('Failed to verify OAuth state');
      }

      if (!oauthState) {
        throw new Error('Invalid or expired OAuth state');
      }

      // Check if state has expired
      if (new Date(oauthState.expires_at) < new Date()) {
        throw new Error('OAuth state has expired');
      }

      // Get user_id from database
      const userId = oauthState.user_id;
      
      if (platform === 'google') {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
        
        if (!clientId || !clientSecret) {
          throw new Error('Missing required Google API credentials');
        }
        
        // Exchange code for token
        const tokenData = await exchangeGoogleToken(clientId, clientSecret, code, redirectUri);
        const { accessToken, refreshToken, expiresIn } = tokenData;
        
        // Verify Google Ads API access
        const googleAdsVerified = await verifyGoogleAdsAccess(
          accessToken, 
          Deno.env.get('GOOGLE_DEVELOPER_TOKEN') || ''
        );
        
        // Store account information
        let accountId = 'unknown';
        let accountData = {};
        
        // If Google Ads API access is verified, we have account data
        if (googleAdsVerified.verified) {
          if (googleAdsVerified.accounts && googleAdsVerified.accounts.length > 0) {
            accountId = googleAdsVerified.accounts[0].replace('customers/', '');
            accountData = {
              googleAdsVerified: true,
              accountCount: googleAdsVerified.accountCount,
              accounts: googleAdsVerified.accounts
            };
          }
        } else {
          accountData = {
            googleAdsVerified: false,
            error: googleAdsVerified.error
          };
        }

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
        
        // Store tokens
        await storeTokens(
          supabase,
          userId,
          platform,
          accessToken,
          refreshToken,
          accountId,
          expiresAt.toISOString(),
          accountData
        );
        
        // Return token info to client
        return new Response(
          JSON.stringify({
            success: true,
            platform,
            googleAdsAccess: googleAdsVerified.verified,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } 
      else if (platform === 'linkedin') {
        const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
        
        if (!clientId || !clientSecret) {
          throw new Error('Missing required LinkedIn API credentials');
        }
        
        // Exchange code for token
        const tokenData = await exchangeLinkedInToken(clientId, clientSecret, code, redirectUri);
        const { accessToken, refreshToken, expiresIn } = tokenData;
        
        // Use the access token to get account information from LinkedIn
        const accountInfo = await getLinkedInAdAccounts(accessToken);
        
        let accountId = 'unknown';
        let accountName = '';
        let accountData = {};
        
        if (accountInfo && accountInfo.elements && accountInfo.elements.length > 0) {
          accountId = accountInfo.elements[0].id;
          accountName = accountInfo.elements[0].name || 'LinkedIn Account';
          accountData = {
            linkedInAdsVerified: true,
            accountCount: accountInfo.elements.length,
            accounts: accountInfo.elements
          };
        } else {
          accountData = {
            linkedInAdsVerified: false,
            error: "No LinkedIn ad accounts found"
          };
        }

        // Calculate expiry date
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
        
        // Store tokens
        await storeTokens(
          supabase,
          userId,
          platform,
          accessToken,
          refreshToken,
          accountId,
          expiresAt.toISOString(),
          accountData
        );
        
        // Return token info to client
        return new Response(
          JSON.stringify({
            success: true,
            platform,
            linkedInAdsAccess: true,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
        );
      } 
      else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    } 
    else {
      throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'An unknown error occurred' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to get LinkedIn Ad accounts using the access token
async function getLinkedInAdAccounts(accessToken: string) {
  try {
    // Get the organization IDs first (needed for ad accounts)
    const orgResponse = await fetch(
      'https://api.linkedin.com/v2/organizationAcls?q=roleAssignee',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!orgResponse.ok) {
      throw new Error(`LinkedIn API error: ${orgResponse.status} ${await orgResponse.text()}`);
    }

    const orgData = await orgResponse.json();
    
    if (!orgData.elements || orgData.elements.length === 0) {
      return { elements: [] };
    }
    
    // Extract organization IDs
    const organizationIds = orgData.elements.map(
      (element: any) => element.organization
    );
    
    if (organizationIds.length === 0) {
      return { elements: [] };
    }
    
    // Get ad accounts for these organizations
    const adAccountsResponse = await fetch(
      'https://api.linkedin.com/v2/adAccountsV2?q=search',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!adAccountsResponse.ok) {
      throw new Error(`LinkedIn Ad API error: ${adAccountsResponse.status} ${await adAccountsResponse.text()}`);
    }

    return await adAccountsResponse.json();
  } catch (error) {
    console.error('Error getting LinkedIn ad accounts:', error);
    return { elements: [] };
  }
}
