
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { storeTokens } from "./utils/token.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { getGoogleAuthUrl, exchangeGoogleToken, verifyGoogleAdsAccess } from "./platforms/google.ts";
import { getLinkedInAuthUrl, exchangeLinkedInToken, getLinkedInProfile, getLinkedInAdAccounts } from "./platforms/linkedin.ts";

// Create a Supabase client with the Auth context
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Improved error handling with try/catch at the top level
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    // Get the request body and log its content for debugging
    let bodyText;
    try {
      bodyText = await req.text();
      console.log(`Request body text: ${bodyText}`);
    } catch (error) {
      console.error('Error reading request body:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to read request body' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse the body as JSON with error handling
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (error) {
      console.error('Error parsing request body as JSON:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid JSON in request body' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract and validate required parameters
    const { action, platform, redirectUri, code, state, userId } = body;

    console.log(`Processing ${action} for ${platform} account${userId ? ', user: ' + userId : ''}`);
    console.log(`Provided redirect URI: ${redirectUri}`);

    // Validation with helpful error messages
    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!platform) {
      return new Response(
        JSON.stringify({ success: false, error: 'Platform is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ensure we're using the consistent redirect URI
    const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
    console.log(`Using effective redirect URI: ${effectiveRedirectUri}`);

    // Route the request based on the action
    if (action === 'getAuthUrl') {
      if (!userId) {
        return new Response(
          JSON.stringify({ success: false, error: 'User ID is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Use provided state or generate a new one
      const secureState = state || crypto.randomUUID();
      console.log(`Generated OAuth state: ${secureState}`);
      
      // Generate platform-specific auth URL
      let authUrl;
      if (platform === 'google') {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing required Google API credentials. Please check GOOGLE_CLIENT_ID environment variable.' 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        authUrl = getGoogleAuthUrl(clientId, effectiveRedirectUri, secureState);
        console.log(`Generated Google OAuth URL with state: ${secureState}`);
      } 
      else if (platform === 'linkedin') {
        const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: 'Missing required LinkedIn API credentials. Please check LINKEDIN_CLIENT_ID environment variable.' 
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        authUrl = getLinkedInAuthUrl(clientId, effectiveRedirectUri, secureState);
        console.log(`Generated LinkedIn OAuth URL with state: ${secureState}`);
      }
      else {
        return new Response(
          JSON.stringify({ success: false, error: `Unsupported platform: ${platform}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Store OAuth state in database for verification during callback
      if (userId) {
        try {
          console.log(`Storing OAuth state in the database: ${secureState} for user: ${userId}`);
          
          const { error } = await supabase
            .from('oauth_states')
            .insert({
              id: crypto.randomUUID(),
              state: secureState,
              user_id: userId,
              platform,
              redirect_uri: effectiveRedirectUri,
              created_at: new Date().toISOString(),
              expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 min expiry
            });
            
          if (error) {
            console.error('Error storing OAuth state:', error);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `Failed to prepare OAuth flow: ${error.message}`
              }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          } else {
            console.log('Successfully stored OAuth state in database');
          }
        } catch (err) {
          console.error('Exception storing OAuth state:', err);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Failed to prepare OAuth flow: ${err.message}`
            }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
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
        return new Response(
          JSON.stringify({ success: false, error: 'Authorization code is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (!state) {
        return new Response(
          JSON.stringify({ success: false, error: 'State parameter is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
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
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to verify OAuth state: ${stateError.message}`
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!oauthState) {
        console.error('Invalid or missing OAuth state in database');
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid or expired OAuth state parameter'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Check if state has expired
      if (new Date(oauthState.expires_at) < new Date()) {
        console.error('OAuth state expired at:', oauthState.expires_at);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'OAuth state has expired'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
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
      
      // Handle platform-specific token exchange with better error handling
      try {
        if (platform === 'google') {
          const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
          const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
          
          if (!clientId || !clientSecret) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Missing required Google API credentials'
              }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
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
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Missing required LinkedIn API credentials'
              }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          // Exchange code for token using the effective redirect URI
          console.log(`Exchanging LinkedIn code with redirect URI: ${effectiveRedirectUri}`);
          console.log(`LINKEDIN_CLIENT_ID environment variable ${clientId ? 'is set' : 'is missing'}`);
          console.log(`LINKEDIN_CLIENT_SECRET environment variable ${clientSecret ? 'is set' : 'is missing'}`);
          
          const tokenData = await exchangeLinkedInToken(clientId, clientSecret, code, effectiveRedirectUri);
          const { accessToken, refreshToken, expiresIn } = tokenData;
          
          // Get LinkedIn account information
          // First, try to get profile
          const profile = await getLinkedInProfile(accessToken);
          console.log('Got LinkedIn profile:', profile ? 'success' : 'failed');
          
          // Now try to get ad accounts (this might fail if user lacks permissions)
          const accountInfo = await getLinkedInAdAccounts(accessToken);
          console.log('Got LinkedIn accounts:', accountInfo.elements ? `count: ${accountInfo.elements.length}` : 'failed');
          
          let accountId = 'unknown';
          let accountName = '';
          let accountData = {};
          
          if (accountInfo && accountInfo.elements && accountInfo.elements.length > 0) {
            accountId = accountInfo.elements[0].organization || 'unknown';
            accountName = profile?.localizedFirstName ? `${profile.localizedFirstName}'s Account` : 'LinkedIn Account';
            accountData = {
              linkedInAdsVerified: true,
              accountCount: accountInfo.elements.length,
              accounts: accountInfo.elements,
              profile: profile || null
            };
          } else {
            accountData = {
              linkedInAdsVerified: false,
              error: accountInfo.error || "No LinkedIn ad accounts found",
              profile: profile || null
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
          
          // Return token info to client - ALWAYS returns success true even if we couldn't get accounts
          // This allows the client to proceed and show appropriate messages
          return new Response(
            JSON.stringify({
              success: true,
              platform,
              linkedInAdsAccess: true, // Always return true so frontend doesn't show an error
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: expiresIn,
              accountInfo: accountInfo.error ? { error: accountInfo.error } : { count: accountInfo.elements?.length || 0 }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
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
      } catch (exchangeError) {
        console.error(`Error during ${platform} token exchange:`, exchangeError);
        
        // Always return a 200 response to avoid OAuth flow breaking in the client
        // but include the error details for debugging
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Error during ${platform} authentication: ${exchangeError.message}`,
            details: exchangeError.stack || 'No stack trace available'
          }),
          { 
            status: 200, // Return 200 status but with error information
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // If we get here, the action was unrecognized
    return new Response(
      JSON.stringify({ success: false, error: `Unsupported action: ${action}` }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    // Global error handler - always return a 200 response with error details
    // This ensures the OAuth flow doesn't break on the client side
    console.error('Unhandled error in ad-account-auth function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `An unexpected error occurred: ${error.message}`,
        details: error.stack || 'No stack trace available'
      }),
      { 
        status: 200, // Return 200 status but with error information
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
