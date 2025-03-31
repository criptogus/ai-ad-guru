import { corsHeaders } from '../utils/cors.ts';
import { exchangeGoogleToken, verifyGoogleAdsAccess } from '../platforms/google.ts';
import { exchangeMetaToken } from '../platforms/meta.ts';
import { exchangeLinkedInToken } from '../platforms/linkedin.ts';
import { exchangeMicrosoftToken } from '../platforms/microsoft.ts';

/**
 * Exchange OAuth authorization code for access token
 */
export async function exchangeToken(supabaseClient: any, requestData: any) {
  const { code, state, platform, redirectUri } = requestData;
  
  if (!code || !state) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Authorization code and state are required' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
  
  try {
    // Verify the state parameter to prevent CSRF attacks
    const { data: stateData, error: stateError } = await supabaseClient
      .from('oauth_states')
      .select('user_id, platform, redirect_uri')
      .eq('state', state)
      .single();
      
    if (stateError || !stateData) {
      console.error('Invalid or expired state parameter:', stateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired authorization state. Please try again.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Extract data from verified state
    const { user_id: userId, platform: statePlatform, redirect_uri: stateRedirectUri } = stateData;
    
    // Use either the provided platform or the one from state
    const effectivePlatform = platform || statePlatform;
    
    if (!effectivePlatform) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Platform identifier not found in request or state data' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Use either the provided redirectUri or the one from state
    const effectiveRedirectUri = redirectUri || stateRedirectUri;
    
    if (!effectiveRedirectUri) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Redirect URI not found in request or state data' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get platform credentials from environment
    const clientId = Deno.env.get(`${effectivePlatform.toUpperCase()}_CLIENT_ID`);
    const clientSecret = Deno.env.get(`${effectivePlatform.toUpperCase()}_CLIENT_SECRET`);
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing API credentials for ${effectivePlatform}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Exchange the code for tokens using platform-specific methods
    console.log(`Exchanging code for ${effectivePlatform} tokens`);
    
    let tokenResponse;
    let metadata = {};
    let googleAdsAccess = undefined;
    
    switch(effectivePlatform) {
      case 'google': 
        tokenResponse = await exchangeGoogleToken(clientId, clientSecret, code, effectiveRedirectUri);
        
        // For Google, verify Google Ads API access
        const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
        
        if (developerToken && tokenResponse.accessToken) {
          console.log('Verifying Google Ads API access...');
          const adsAccessResult = await verifyGoogleAdsAccess(tokenResponse.accessToken, developerToken);
          
          if (adsAccessResult.verified) {
            console.log(`Google Ads API access verified. Found ${adsAccessResult.accountCount} accounts.`);
            metadata.googleAdsVerified = true;
            metadata.accountCount = adsAccessResult.accountCount;
            googleAdsAccess = true;
            
            if (adsAccessResult.accounts && adsAccessResult.accounts.length > 0) {
              // Extract account ID from the first resource name (format: customers/1234567890)
              const firstAccount = adsAccessResult.accounts[0];
              const accountIdMatch = firstAccount.match(/customers\/(\d+)/);
              const accountId = accountIdMatch ? accountIdMatch[1] : 'unknown';
              
              metadata.accountId = accountId;
            }
          } else {
            console.warn('Failed to verify Google Ads API access:', adsAccessResult.error);
            metadata.googleAdsVerified = false;
            metadata.verificationError = adsAccessResult.error;
            googleAdsAccess = false;
          }
        } else {
          console.warn('Google Ads developer token not configured or access token not available');
          metadata.googleAdsDeveloperTokenMissing = !developerToken;
          googleAdsAccess = false;
        }
        break;
      
      case 'meta': 
        tokenResponse = await exchangeMetaToken(clientId, clientSecret, code, effectiveRedirectUri); 
        break;
        
      case 'linkedin': 
        tokenResponse = await exchangeLinkedInToken(clientId, clientSecret, code, effectiveRedirectUri); 
        break;
        
      case 'microsoft': 
        tokenResponse = await exchangeMicrosoftToken(clientId, clientSecret, code, effectiveRedirectUri); 
        break;
        
      default:
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Unsupported platform: ${effectivePlatform}` 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
    
    if (!tokenResponse) {
      throw new Error(`Failed to exchange token for ${effectivePlatform}`);
    }
    
    // Log important info but no sensitive data
    console.log(`Token exchange successful for ${effectivePlatform}`);
    console.log(`Access token received: ${tokenResponse.accessToken ? 'Yes' : 'No'}`);
    console.log(`Refresh token received: ${tokenResponse.refreshToken ? 'Yes' : 'No'}`);
    
    // Save user tokens in the database
    const { data: connectionData, error: connectionError } = await supabaseClient
      .from('user_integrations')
      .upsert(
        {
          user_id: userId,
          platform: effectivePlatform,
          access_token: tokenResponse.accessToken,
          refresh_token: tokenResponse.refreshToken || null,
          expires_at: tokenResponse.expiresIn 
            ? new Date(Date.now() + tokenResponse.expiresIn * 1000).toISOString() 
            : null,
          updated_at: new Date().toISOString(),
          metadata: metadata
        },
        { onConflict: 'user_id,platform', returning: 'minimal' }
      );
      
    if (connectionError) {
      console.error('Error saving connection:', connectionError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Failed to save connection: ${connectionError.message}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Clean up the used state
    await supabaseClient
      .from('oauth_states')
      .delete()
      .eq('state', state);
      
    return new Response(
      JSON.stringify({ 
        success: true,
        platform: effectivePlatform,
        googleAdsAccess: googleAdsAccess
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Token exchange error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Token exchange failed: ${error.message}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
