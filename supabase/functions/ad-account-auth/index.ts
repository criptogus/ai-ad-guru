import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { storeTokens } from "./utils/token.ts";
import { handleRequestError } from "./utils/error-handler.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { getGoogleAuthUrl, exchangeGoogleToken, verifyGoogleAdsAccess } from "./platforms/google.ts";
import { getLinkedInAuthUrl, exchangeLinkedInToken, getLinkedInProfile, getLinkedInAdAccounts } from "./platforms/linkedin.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

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
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

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
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { action, platform, redirectUri, code, state, userId } = body;

    console.log(`Processing ${action} for ${platform} account${userId ? ', user: ' + userId : ''}`);
    console.log(`Provided redirect URI: ${redirectUri}`);

    if (!action) {
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (!platform) {
      return new Response(
        JSON.stringify({ success: false, error: 'Platform is required' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const effectiveRedirectUri = 'https://auth.zeroagency.ai/auth/v1/callback';
    console.log(`Using effective redirect URI: ${effectiveRedirectUri}`);

    try {
      const { data, error } = await supabaseAdmin
        .from('oauth_states')
        .select('*', { count: 'exact', head: true });
        
      if (error && error.code !== 'PGRST204') {
        console.log('Creating oauth_states table...');
        
        await supabaseAdmin.rpc('create_oauth_states_table');
        console.log('oauth_states table created successfully');
      }
    } catch (tableError) {
      console.error('Error checking/creating oauth_states table:', tableError);
    }

    if (action === 'getAuthUrl') {
      if (!userId) {
        return new Response(
          JSON.stringify({ success: false, error: 'User ID is required' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const secureState = state || crypto.randomUUID();
      console.log(`Generated OAuth state: ${secureState}`);
      
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
              status: 200, 
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
              status: 200, 
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
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      try {
        console.log(`Storing OAuth state ${secureState} for user: ${userId}, platform: ${platform}`);
        
        const { error } = await supabaseAdmin
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
          console.log('Continuing despite error storing OAuth state');
        } else {
          console.log('Successfully stored OAuth state in database');
        }
      } catch (err) {
        console.error('Exception storing OAuth state:', err);
        console.log('Continuing despite error storing OAuth state');
      }

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
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (!state) {
        return new Response(
          JSON.stringify({ success: false, error: 'State parameter is required' }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Verifying OAuth state: ${state}`);

      const { data: oauthState, error: stateError } = await supabaseAdmin
        .from('oauth_states')
        .select('*')
        .eq('state', state)
        .maybeSingle();
      
      if (stateError) {
        console.error('Error verifying OAuth state:', stateError);
        
        if (!userId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Failed to verify OAuth state: ${stateError.message}`
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        console.log(`Using provided userId: ${userId} since state verification failed`);
      }

      let effectiveUserId = oauthState?.user_id || userId;
      let effectivePlatform = oauthState?.platform || platform;
      
      if (!effectiveUserId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'User ID not found. Please try reconnecting your account.'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      if (!effectivePlatform) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Platform not specified. Please try reconnecting your account.'
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      console.log(`OAuth processing for user ${effectiveUserId} and platform ${effectivePlatform}`);
      
      if (oauthState) {
        const { error: deleteError } = await supabaseAdmin
          .from('oauth_states')
          .delete()
          .eq('state', state);
          
        if (deleteError) {
          console.warn('Error deleting used OAuth state:', deleteError);
        }
      }
      
      try {
        if (effectivePlatform === 'google') {
          const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
          const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
          
          if (!clientId || !clientSecret) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Missing required Google API credentials'
              }),
              { 
                status: 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          console.log(`Exchanging Google code with redirect URI: ${effectiveRedirectUri}`);
          const tokenData = await exchangeGoogleToken(clientId, clientSecret, code, effectiveRedirectUri);
          const { accessToken, refreshToken, expiresIn } = tokenData;
          
          const googleAdsVerified = await verifyGoogleAdsAccess(
            accessToken, 
            Deno.env.get('GOOGLE_DEVELOPER_TOKEN') || ''
          );
          
          let accountId = 'unknown';
          let accountData = {};
          
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

          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
          
          await storeTokens(
            supabaseAdmin,
            effectiveUserId,
            effectivePlatform,
            accessToken,
            refreshToken,
            accountId,
            expiresAt.toISOString(),
            accountData
          );
          
          return new Response(
            JSON.stringify({
              success: true,
              platform: effectivePlatform,
              googleAdsAccess: googleAdsVerified.verified,
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_in: expiresIn
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } 
        else if (effectivePlatform === 'linkedin') {
          const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
          const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
          
          if (!clientId || !clientSecret) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: 'Missing required LinkedIn API credentials'
              }),
              { 
                status: 200, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
          
          console.log(`Exchanging LinkedIn code with redirect URI: ${effectiveRedirectUri}`);
          console.log(`LINKEDIN_CLIENT_ID environment variable ${clientId ? 'is set' : 'is missing'}`);
          console.log(`LINKEDIN_CLIENT_SECRET environment variable ${clientSecret ? 'is set' : 'is missing'}`);
          
          const tokenData = await exchangeLinkedInToken(clientId, clientSecret, code, effectiveRedirectUri);
          const { accessToken, refreshToken, expiresIn } = tokenData;
          
          const profile = await getLinkedInProfile(accessToken);
          console.log('Got LinkedIn profile:', profile ? 'success' : 'failed');
          
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

          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);
          
          await storeTokens(
            supabaseAdmin,
            effectiveUserId,
            effectivePlatform,
            accessToken,
            refreshToken,
            accountId,
            expiresAt.toISOString(),
            accountData
          );
          
          return new Response(
            JSON.stringify({
              success: true,
              platform: effectivePlatform,
              linkedInAdsAccess: true,
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
              error: `Unsupported platform: ${effectivePlatform}`
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (exchangeError) {
        return handleRequestError(exchangeError);
      }
    }

    return new Response(
      JSON.stringify({ success: false, error: `Unsupported action: ${action}` }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return handleRequestError(error);
  }
});
