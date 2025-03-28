
import { corsHeaders } from '../utils/cors.ts';
import { getGoogleAuthUrl } from '../platforms/google.ts';
import { getMetaAuthUrl } from '../platforms/meta.ts';
import { getLinkedInAuthUrl } from '../platforms/linkedin.ts';
import { getMicrosoftAuthUrl } from '../platforms/microsoft.ts';

/**
 * Generate OAuth authorization URL for a specified platform
 */
export async function getAuthUrl(supabaseClient: any, requestData: any) {
  const { platform, redirectUri, userId } = requestData;
  
  try {
    // Get platform credentials from environment
    const clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
    const clientSecret = Deno.env.get(`${platform.toUpperCase()}_CLIENT_SECRET`);
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Missing ${platform} API credentials. Please check your environment variables.`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Generate a secure state parameter to prevent CSRF attacks
    const state = crypto.randomUUID();
    
    // Store auth state in the database for verification
    const { error: stateError } = await supabaseClient
      .from('oauth_states')
      .insert({
        state,
        user_id: userId,
        platform,
        created_at: new Date().toISOString(),
        redirect_uri: redirectUri
      });
      
    if (stateError) {
      console.error('Failed to store OAuth state:', stateError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Failed to prepare OAuth flow: ${stateError.message}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Generate platform-specific auth URL
    let authUrl;
    if (platform === 'google') {
      authUrl = getGoogleAuthUrl(clientId, redirectUri, state);
    } else if (platform === 'meta') {
      authUrl = getMetaAuthUrl(clientId, redirectUri, state);
    } else if (platform === 'linkedin') {
      authUrl = getLinkedInAuthUrl(clientId, redirectUri, state);
    } else if (platform === 'microsoft') {
      authUrl = getMicrosoftAuthUrl(clientId, redirectUri, state);
    } else {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Unsupported platform: ${platform}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
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
  } catch (error) {
    console.error(`Error generating ${platform} auth URL:`, error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to generate ${platform} auth URL: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
