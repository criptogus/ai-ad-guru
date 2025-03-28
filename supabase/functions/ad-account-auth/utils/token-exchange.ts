
/**
 * Token exchange utilities for various ad platforms
 */
import { exchangeGoogleToken } from "../platforms/google.ts";
import { exchangeMetaToken } from "../platforms/meta.ts";
import { exchangeLinkedInToken } from "../platforms/linkedin.ts";
import { exchangeMicrosoftToken } from "../platforms/microsoft.ts";

/**
 * Exchange authorization code for tokens based on platform
 */
export async function exchangeToken(
  platform: string,
  code: string,
  redirectUri: string
): Promise<any> {
  // Get platform credentials from environment
  const clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
  const clientSecret = Deno.env.get(`${platform.toUpperCase()}_CLIENT_SECRET`);
  
  if (!clientId || !clientSecret) {
    throw new Error(`Missing ${platform} API credentials`);
  }
  
  // Exchange the code for tokens based on platform
  let tokenResponse;
  
  try {
    if (platform === 'google') {
      tokenResponse = await exchangeGoogleToken(clientId, clientSecret, code, redirectUri);
    } else if (platform === 'meta') {
      tokenResponse = await exchangeMetaToken(clientId, clientSecret, code, redirectUri);
    } else if (platform === 'linkedin') {
      tokenResponse = await exchangeLinkedInToken(clientId, clientSecret, code, redirectUri);
    } else if (platform === 'microsoft') {
      tokenResponse = await exchangeMicrosoftToken(clientId, clientSecret, code, redirectUri);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return tokenResponse;
  } catch (error) {
    console.error(`Token exchange error for ${platform}:`, error);
    throw error;
  }
}

/**
 * Save tokens to user_integrations table
 */
export async function saveUserTokens(
  supabaseClient: any, 
  userId: string, 
  platform: string, 
  tokens: any
): Promise<{ id: string; platform: string }> {
  // Calculate token expiration
  const expiresAt = tokens.expiresIn 
    ? new Date(Date.now() + tokens.expiresIn * 1000).toISOString() 
    : null;
  
  // Store tokens in database
  const { data, error } = await supabaseClient
    .from('user_integrations')
    .upsert(
      {
        user_id: userId,
        platform,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken || null,
        expires_at: expiresAt,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id,platform', returning: 'minimal' }
    )
    .select('id, platform');
  
  if (error) {
    console.error('Error saving tokens:', error);
    throw new Error(`Failed to save tokens: ${error.message}`);
  }
  
  return data[0];
}
