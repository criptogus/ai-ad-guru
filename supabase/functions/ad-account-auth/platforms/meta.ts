
import { corsHeaders } from "../utils/cors.ts";

/**
 * Generate Meta (Facebook) authorization URL
 */
export function getMetaAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  // Set up Meta OAuth parameters
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: "ads_management,ads_read,business_management",
    response_type: "code",
  });

  // Generate the authorization URL
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  return authUrl;
}

/**
 * Exchange authorization code for Meta (Facebook) tokens
 */
export async function exchangeMetaToken(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<any> {
  try {
    // Prepare token request
    const tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token";
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code,
    });

    // Make the token request
    const response = await fetch(tokenUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meta token exchange error:", errorText);
      throw new Error(`Meta API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Format token response to match our standard
    return {
      accessToken: data.access_token,
      refreshToken: null, // Meta doesn't return refresh tokens in this flow
      expiresIn: data.expires_in || 5184000, // Default to 60 days if not specified
    };
  } catch (error) {
    console.error("Error exchanging Meta token:", error);
    throw error;
  }
}
