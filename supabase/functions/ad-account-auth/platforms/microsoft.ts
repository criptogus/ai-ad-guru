
import { corsHeaders } from "../utils/cors.ts";

/**
 * Generate Microsoft authorization URL
 */
export function getMicrosoftAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  // Set up Microsoft OAuth parameters
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: "https://ads.microsoft.com/msads.manage offline_access",
    response_type: "code"
  });

  // Generate the authorization URL
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
  return authUrl;
}

/**
 * Exchange authorization code for Microsoft tokens
 */
export async function exchangeMicrosoftToken(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<any> {
  try {
    // Prepare token request
    const tokenUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code"
    });

    // Make the token request
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...corsHeaders
      },
      body: params.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Microsoft token exchange error:", errorText);
      throw new Error(`Microsoft API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Format token response to match our standard
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in || 3600 // Default to 1 hour if not specified
    };
  } catch (error) {
    console.error("Error exchanging Microsoft token:", error);
    throw error;
  }
}
