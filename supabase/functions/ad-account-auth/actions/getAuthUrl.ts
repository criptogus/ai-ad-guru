
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
  
  if (!platform || !redirectUri || !userId) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Missing required parameters'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
  
  try {
    // Get platform credentials from environment
    const clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
    const clientSecret = Deno.env.get(`${platform.toUpperCase()}_CLIENT_SECRET`);
    
    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Missing API credentials for ${platform}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Generate a secure state parameter using a more efficient method
    const state = crypto.randomUUID();
    
    // Store auth state in the database for verification - with minimal data
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
      console.error('OAuth state error:', stateError.message);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to prepare OAuth flow'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
    
    // Generate platform-specific auth URL with optimized function calls
    let authUrl;
    switch(platform) {
      case 'google':
        authUrl = getGoogleAuthUrl(clientId, redirectUri, state);
        break;
      case 'meta':
        authUrl = getMetaAuthUrl(clientId, redirectUri, state);
        break;
      case 'linkedin':
        authUrl = getLinkedInAuthUrl(clientId, redirectUri, state);
        break;
      case 'microsoft':
        authUrl = getMicrosoftAuthUrl(clientId, redirectUri, state);
        break;
      default:
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Auth URL error (${platform}):`, errorMessage);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Failed to generate auth URL: ${errorMessage}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}
