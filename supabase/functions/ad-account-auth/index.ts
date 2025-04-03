
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
    console.log(`Using redirect URI: ${redirectUri}`);

    // Validation
    if (!action) {
      throw new Error('Action is required');
    }
    
    if (!platform) {
      throw new Error('Platform is required');
    }

    // Ensure we're using the consistent redirect URI
    const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
    console.log(`Using effective redirect URI: ${effectiveRedirectUri}`);

    // Route the request based on the action
    if (action === 'getAuthUrl') {
      if (!redirectUri) {
        throw new Error('Redirect URI is required');
      }

      // Use provided state or generate a new one
      const secureState = state || crypto.randomUUID();
      console.log(`Generated OAuth state: ${secureState}`);
      
      // Generate platform-specific auth URL
      let authUrl;
      if (platform === 'google') {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) {
          throw new Error('Missing required Google API credentials');
        }
        authUrl = getGoogleAuthUrl(clientId, effectiveRedirectUri, secureState);
        console.log(`Generated Google OAuth URL with state: ${secureState}`);
      } 
      else if (platform === 'linkedin') {
        const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        if (!clientId) {
          throw new Error('Missing required LinkedIn API credentials');
        }
        authUrl = getLinkedInAuthUrl(clientId, effectiveRedirectUri, secureState);
        console.log(`Generated LinkedIn OAuth URL with state: ${secureState}`);
      }
      else {
        throw new Error(`Unsupported platform: ${platform}`);
      }

      // Store OAuth state in database for verification during callback
      if (userId) {
        try {
          console.log(`Storing OAuth state in the database: ${secureState} for user: ${userId}`);
          
          const { error } = await supabase
            .from('oauth_states')
            .insert({
              state: secureState,
              user_id: userId,
              platform,
              redirect_uri: effectiveRedirectUri,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
            });
            
          if (error) {
            console.error('Error storing OAuth state:', error);
            throw new Error(`Failed to prepare OAuth flow: ${error.message}`);
          } else {
            console.log('Successfully stored OAuth state in database');
          }
        } catch (err) {
          console.error('Exception storing OAuth state:', err);
          throw new Error('Failed to prepare OAuth flow: ' + err.message);
        }
      }

      // Return the authorization URL
      return new Response(
        JSON.stringify({ success: true, authUrl, state: secureState }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (action === 'exchangeToken') {
      if (!code) {
        throw new Error('Authorization code is required');
      }
      
      if (!state) {
        throw new Error('State parameter is required');
      }

      // Log the state parameter
      console.log(`Verifying OAuth state: ${state}`);

      // Verify OAuth state from database
      const { data: oauthState, error: stateError } = await supabase
        .from('oauth_states')
        .select('*')
        .eq('state', state)
        .maybeSingle();
      
      if (stateError) {
        console.error('Error verifying OAuth state:', stateError);
        throw new Error('Failed to verify OAuth state: ' + stateError.message);
      }

      if (!oauthState) {
        console.error('Invalid or missing OAuth state in database');
        throw new Error('Invalid or expired OAuth state parameter');
      }

      // Check if state has expired
      if (new Date(oauthState.expires_at) < new Date()) {
        console.error('OAuth state expired at:', oauthState.expires_at);
        throw new Error('OAuth state has expired');
      }

      // Get user_id from database
      const userId = oauthState.user_id;
      
      // Log that state verification succeeded
      console.log(`OAuth state verified successfully for user ${userId}`);
      
      // Clean up the used state to prevent replay attacks
      const { error: deleteError } = await supabase
        .from('oauth_states')
        .delete()
        .eq('state', state);
        
      if (deleteError) {
        console.warn('Error deleting used OAuth state:', deleteError);
      }
      
      // Handle platform-specific token exchange
      if (platform === 'google') {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
        
        if (!clientId || !clientSecret) {
          throw new Error('Missing required Google API credentials');
        }
        
        // Exchange code for token using the effective redirect URI
        console.log(`Exchanging Google code with redirect URI: ${effectiveRedirectUri}`);
        const tokenData = await exchangeGoogleToken(clientId, clientSecret, code, effectiveRedirectUri);
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
        
        // Exchange code for token using the effective redirect URI
        console.log(`Exchanging LinkedIn code with redirect URI: ${effectiveRedirectUri}`);
        const tokenData = await exchangeLinkedInToken(clientId, clientSecret, code, effectiveRedirectUri);
        const { accessToken, refreshToken, expiresIn } = tokenData;
        
        // Note: This call to getLinkedInAdAccounts will fail in the current code state
        // We need to implement proper error handling for it
        let accountInfo = { elements: [] };
        try {
          accountInfo = await getLinkedInAdAccounts(accessToken);
        } catch (err) {
          console.warn('Error getting LinkedIn ad accounts:', err);
          // Continue despite error
        }
        
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
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Unsupported platform: ${platform}`);
    }

    throw new Error(`Unsupported action: ${action}`);
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error: ${error.message}` 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Placeholder function for LinkedIn ad accounts retrieval
async function getLinkedInAdAccounts(accessToken: string): Promise<any> {
  try {
    // This is a placeholder function - it would normally make API calls to LinkedIn
    // but for now we just return an empty array to avoid errors
    console.log('Getting LinkedIn ad accounts (placeholder function)');
    return { elements: [] };
  } catch (error) {
    console.error('Error getting LinkedIn ad accounts:', error);
    return { elements: [] };
  }
}
