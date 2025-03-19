
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google OAuth constants
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/adwords";

// Meta OAuth constants
const META_OAUTH_URL = "https://www.facebook.com/v17.0/dialog/oauth";
const META_TOKEN_URL = "https://graph.facebook.com/v17.0/oauth/access_token";
const META_SCOPE = "ads_management,ads_read,business_management";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase URL or service role key");
      throw new Error("Server configuration error");
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      throw new Error("Invalid request format");
    }
    
    const { action, platform, code, redirectUri, userId, state } = requestBody;
    
    console.log(`Received auth request - action: ${action}, platform: ${platform}, userId: ${userId}, redirectUri: ${redirectUri}`);
    
    // Generate OAuth URL
    if (action === 'getAuthUrl') {
      let clientId;
      
      // Check all required environment variables before proceeding
      if (platform === 'google') {
        clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
        const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
        
        console.log("Google credentials available:", 
          `Client ID: ${clientId ? 'Yes' : 'No'}`, 
          `Client Secret: ${clientSecret ? 'Yes' : 'No'}`,
          `Developer Token: ${developerToken ? 'Yes' : 'No'}`);
        
        if (!clientId || !clientSecret || !developerToken) {
          const missingVars = [];
          if (!clientId) missingVars.push('GOOGLE_CLIENT_ID');
          if (!clientSecret) missingVars.push('GOOGLE_CLIENT_SECRET');
          if (!developerToken) missingVars.push('GOOGLE_DEVELOPER_TOKEN');
          
          throw new Error(`Missing required Google Ads credentials: ${missingVars.join(', ')}`);
        }
      } else if (platform === 'meta') {
        clientId = Deno.env.get('META_CLIENT_ID');
        const clientSecret = Deno.env.get('META_CLIENT_SECRET');
        
        console.log("Meta credentials available:", 
          `Client ID: ${clientId ? 'Yes' : 'No'}`, 
          `Client Secret: ${clientSecret ? 'Yes' : 'No'}`);
        
        if (!clientId || !clientSecret) {
          const missingVars = [];
          if (!clientId) missingVars.push('META_CLIENT_ID');
          if (!clientSecret) missingVars.push('META_CLIENT_SECRET');
          
          throw new Error(`Missing required Meta Ads credentials: ${missingVars.join(', ')}`);
        }
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
      
      // Generate a unique state parameter to prevent CSRF
      const stateParam = crypto.randomUUID();
      
      // Store the state parameter with user ID temporarily
      const tempState = {
        userId,
        platform,
        redirectUri,
        created: new Date().toISOString()
      };
      
      // Store state in Supabase's oauth_states table
      const { error: stateError } = await supabaseClient
        .from('oauth_states')
        .insert({
          state: stateParam,
          data: tempState,
          expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minute expiry
        });
      
      if (stateError) {
        console.error("Error storing OAuth state:", stateError);
        throw new Error("Failed to prepare OAuth flow: " + stateError.message);
      }
      
      let authUrl;
      if (platform === 'google') {
        authUrl = `${GOOGLE_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(GOOGLE_SCOPE)}&response_type=code&state=${stateParam}&access_type=offline&prompt=consent`;
      } else if (platform === 'meta') {
        authUrl = `${META_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(META_SCOPE)}&response_type=code&state=${stateParam}`;
      }
      
      console.log(`Generated ${platform} auth URL with redirect to: ${redirectUri}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          authUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // Exchange code for token
    if (action === 'exchangeToken') {
      if (!code) {
        throw new Error("Authorization code is required");
      }
      
      // Validate state parameter to prevent CSRF attacks
      if (!state) {
        throw new Error("State parameter is missing");
      }
      
      // Retrieve and validate the state
      const { data: stateData, error: stateError } = await supabaseClient
        .from('oauth_states')
        .select('data')
        .eq('state', state)
        .single();
      
      if (stateError || !stateData) {
        console.error("Error retrieving OAuth state:", stateError);
        throw new Error("Invalid or expired OAuth state");
      }
      
      // Use the stored data from the state
      const { userId, platform, redirectUri } = stateData.data;
      
      // Clean up the used state
      await supabaseClient
        .from('oauth_states')
        .delete()
        .eq('state', state);
      
      let clientId, clientSecret;
      
      if (platform === 'google') {
        clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
        console.log("Google credentials available:", !!clientId, !!clientSecret);
      } else if (platform === 'meta') {
        clientId = Deno.env.get('META_CLIENT_ID');
        clientSecret = Deno.env.get('META_CLIENT_SECRET');
        console.log("Meta credentials available:", !!clientId, !!clientSecret);
      }
      
      if (!clientId || !clientSecret) {
        console.error(`${platform} OAuth credentials not configured`);
        throw new Error(`${platform} OAuth credentials not configured in server environment`);
      }
      
      // Exchange the code for tokens
      const tokenParams = new URLSearchParams();
      tokenParams.append('client_id', clientId);
      tokenParams.append('client_secret', clientSecret);
      tokenParams.append('code', code);
      tokenParams.append('redirect_uri', redirectUri);
      
      if (platform === 'google') {
        tokenParams.append('grant_type', 'authorization_code');
      }
      
      const tokenUrl = platform === 'google' ? GOOGLE_TOKEN_URL : META_TOKEN_URL;
      
      console.log(`Exchanging code for tokens at ${tokenUrl} with redirect_uri: ${redirectUri}`);
      
      try {
        const tokenResponse = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: tokenParams.toString()
        });
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text();
          console.error(`Token exchange failed (${tokenResponse.status}): ${errorText}`);
          throw new Error(`Failed to exchange code for tokens: ${tokenResponse.status} - ${errorText}`);
        }
        
        const tokenData = await tokenResponse.json();
        console.log('Token exchange successful');
        
        // For Google, we need to make an additional request to get account information
        let accountId = '';
        
        if (platform === 'google') {
          const accessToken = tokenData.access_token;
          const googleAdsUrl = 'https://googleads.googleapis.com/v14/customers:listAccessibleCustomers';
          
          try {
            const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
            if (!developerToken) {
              console.warn('Google developer token not configured');
              accountId = 'developer-token-missing';
            } else {
              const customerResponse = await fetch(googleAdsUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'developer-token': developerToken,
                }
              });
              
              if (!customerResponse.ok) {
                const errorText = await customerResponse.text();
                console.warn('Failed to retrieve Google Ads customer info:', errorText);
                accountId = 'retrieval-error';
              } else {
                const customerData = await customerResponse.json();
                if (customerData.resourceNames && customerData.resourceNames.length > 0) {
                  // Extract the customer ID from the resource name (format: customers/1234567890)
                  accountId = customerData.resourceNames[0].split('/')[1] || 'unknown';
                } else {
                  accountId = 'no-accounts';
                }
              }
            }
          } catch (error) {
            console.error('Error retrieving Google Ads account info:', error);
            accountId = 'error-retrieving';
          }
        } else if (platform === 'meta') {
          // For Meta, we need to make an additional request to get Ad Account information
          try {
            const meResponse = await fetch(`https://graph.facebook.com/v17.0/me/adaccounts?access_token=${tokenData.access_token}`);
            
            if (!meResponse.ok) {
              const errorText = await meResponse.text();
              console.warn('Failed to retrieve Meta Ad accounts:', errorText);
              accountId = 'unknown';
            } else {
              const meData = await meResponse.json();
              if (meData.data && meData.data.length > 0) {
                // Take the first Ad Account ID
                accountId = meData.data[0].id || 'unknown';
              } else {
                accountId = 'no-accounts';
              }
            }
          } catch (error) {
            console.error('Error retrieving Meta Ad account info:', error);
            accountId = 'error-retrieving';
          }
        }
        
        // Calculate token expiration (if provided by the platform)
        let expiresAt = null;
        if (tokenData.expires_in) {
          expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
        }
        
        // Store the tokens in Supabase
        const { data, error } = await supabaseClient
          .from('user_integrations')
          .upsert({
            user_id: userId,
            platform,
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token || null,
            account_id: accountId,
            expires_at: expiresAt
          }, {
            onConflict: 'user_id,platform'
          });
        
        if (error) {
          console.error('Error storing tokens:', error);
          throw error;
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Successfully connected to ${platform === 'google' ? 'Google' : 'Meta'} Ads`,
            accountId
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (fetchError) {
        console.error(`Error during token exchange:`, fetchError);
        throw new Error(`Token exchange failed: ${fetchError.message}`);
      }
    }
    
    throw new Error(`Invalid action specified: ${action}`);
    
  } catch (error) {
    console.error(`Error processing request:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
