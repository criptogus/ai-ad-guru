
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

// LinkedIn OAuth constants
const LINKEDIN_OAUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_SCOPE = "r_liteprofile r_emailaddress w_member_social rw_ads";

// Microsoft OAuth constants
const MICROSOFT_OAUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const MICROSOFT_SCOPE = "offline_access https://ads.microsoft.com/msads.manage";

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
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error"
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request format"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
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
          
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Missing required Google Ads credentials: ${missingVars.join(', ')}`
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else if (platform === 'linkedin') {
        clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
        
        console.log("LinkedIn credentials available:", 
          `Client ID: ${clientId ? 'Yes' : 'No'}`, 
          `Client Secret: ${clientSecret ? 'Yes' : 'No'}`);
        
        if (!clientId || !clientSecret) {
          const missingVars = [];
          if (!clientId) missingVars.push('LINKEDIN_CLIENT_ID');
          if (!clientSecret) missingVars.push('LINKEDIN_CLIENT_SECRET');
          
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Missing required LinkedIn Ads credentials: ${missingVars.join(', ')}`
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else if (platform === 'microsoft') {
        clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
        const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
        const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
        
        console.log("Microsoft credentials available:", 
          `Client ID: ${clientId ? 'Yes' : 'No'}`, 
          `Client Secret: ${clientSecret ? 'Yes' : 'No'}`,
          `Developer Token: ${developerToken ? 'Yes' : 'No'}`);
        
        if (!clientId || !clientSecret || !developerToken) {
          const missingVars = [];
          if (!clientId) missingVars.push('MICROSOFT_CLIENT_ID');
          if (!clientSecret) missingVars.push('MICROSOFT_CLIENT_SECRET');
          if (!developerToken) missingVars.push('MICROSOFT_DEVELOPER_TOKEN');
          
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Missing required Microsoft Ads credentials: ${missingVars.join(', ')}`
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Unsupported platform: ${platform}`
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
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
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to prepare OAuth flow: " + stateError.message
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      let authUrl;
      if (platform === 'google') {
        authUrl = `${GOOGLE_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(GOOGLE_SCOPE)}&response_type=code&state=${stateParam}&access_type=offline&prompt=consent`;
      } else if (platform === 'linkedin') {
        authUrl = `${LINKEDIN_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(LINKEDIN_SCOPE)}&response_type=code&state=${stateParam}`;
      } else if (platform === 'microsoft') {
        authUrl = `${MICROSOFT_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(MICROSOFT_SCOPE)}&response_type=code&state=${stateParam}`;
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
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Authorization code is required"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Validate state parameter to prevent CSRF attacks
      if (!state) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "State parameter is missing"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Retrieve and validate the state
      const { data: stateData, error: stateError } = await supabaseClient
        .from('oauth_states')
        .select('data')
        .eq('state', state)
        .single();
      
      if (stateError || !stateData) {
        console.error("Error retrieving OAuth state:", stateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Invalid or expired OAuth state"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
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
      } else if (platform === 'linkedin') {
        clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
        console.log("LinkedIn credentials available:", !!clientId, !!clientSecret);
      } else if (platform === 'microsoft') {
        clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
        clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
        console.log("Microsoft credentials available:", !!clientId, !!clientSecret);
      }
      
      if (!clientId || !clientSecret) {
        console.error(`${platform} OAuth credentials not configured`);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `${platform} OAuth credentials not configured in server environment`
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Exchange the code for tokens
      const tokenParams = new URLSearchParams();
      tokenParams.append('client_id', clientId);
      tokenParams.append('client_secret', clientSecret);
      tokenParams.append('code', code);
      tokenParams.append('redirect_uri', redirectUri);
      
      if (platform === 'google' || platform === 'microsoft') {
        tokenParams.append('grant_type', 'authorization_code');
      }
      
      let tokenUrl;
      if (platform === 'google') {
        tokenUrl = GOOGLE_TOKEN_URL;
      } else if (platform === 'linkedin') {
        tokenUrl = LINKEDIN_TOKEN_URL;
      } else if (platform === 'microsoft') {
        tokenUrl = MICROSOFT_TOKEN_URL;
      }
      
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
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Failed to exchange code for tokens: ${tokenResponse.status} - ${errorText}`
            }),
            {
              status: tokenResponse.status,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        const tokenData = await tokenResponse.json();
        console.log('Token exchange successful');
        
        // Retrieve account information based on platform
        let accountId = '';
        
        if (platform === 'google') {
          // Google Ads account retrieval logic
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
        } else if (platform === 'linkedin') {
          // LinkedIn Ads account retrieval logic
          try {
            const accessToken = tokenData.access_token;
            // Get LinkedIn user profile to get the account ID
            const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              }
            });
            
            if (!profileResponse.ok) {
              const errorText = await profileResponse.text();
              console.warn('Failed to retrieve LinkedIn profile:', errorText);
              accountId = 'retrieval-error';
            } else {
              const profileData = await profileResponse.json();
              accountId = profileData.id || 'unknown';
              
              // Try to get ad accounts if available
              try {
                const adAccountsResponse = await fetch('https://api.linkedin.com/v2/adAccountsV2?q=search&search.account.reference-locale.language=en&search.account.reference-locale.country=US', {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                  }
                });
                
                if (adAccountsResponse.ok) {
                  const adAccountsData = await adAccountsResponse.json();
                  if (adAccountsData.elements && adAccountsData.elements.length > 0) {
                    // Use the first ad account's ID
                    accountId = adAccountsData.elements[0].id || accountId;
                  }
                }
              } catch (adAccountError) {
                console.error('Error retrieving LinkedIn ad accounts:', adAccountError);
                // Continue with just the profile ID
              }
            }
          } catch (error) {
            console.error('Error retrieving LinkedIn account info:', error);
            accountId = 'error-retrieving';
          }
        } else if (platform === 'microsoft') {
          // Microsoft Ads account retrieval logic
          try {
            const accessToken = tokenData.access_token;
            const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
            
            if (!developerToken) {
              console.warn('Microsoft developer token not configured');
              accountId = 'developer-token-missing';
            } else {
              // Get Microsoft Ads accounts
              const msAdsUrl = 'https://api.ads.microsoft.com/v13/customer-management/accounts';
              
              const accountsResponse = await fetch(msAdsUrl, {
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'DeveloperToken': developerToken
                }
              });
              
              if (!accountsResponse.ok) {
                const errorText = await accountsResponse.text();
                console.warn('Failed to retrieve Microsoft Ads accounts:', errorText);
                accountId = 'retrieval-error';
              } else {
                const accountsData = await accountsResponse.json();
                if (accountsData.value && accountsData.value.length > 0) {
                  // Use the first account's ID
                  accountId = accountsData.value[0].Id.toString() || 'unknown';
                } else {
                  accountId = 'no-accounts';
                }
              }
            }
          } catch (error) {
            console.error('Error retrieving Microsoft Ads account info:', error);
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
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: error.message || "Failed to store connection details"
            }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Successfully connected to ${platform === 'google' ? 'Google' : platform === 'linkedin' ? 'LinkedIn' : 'Microsoft'} Ads`,
            accountId
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (fetchError) {
        console.error(`Error during token exchange:`, fetchError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: fetchError.message || "Token exchange failed"
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Invalid action specified: ${action}`
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error(`Error processing request:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
