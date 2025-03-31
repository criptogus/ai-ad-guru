
import { corsHeaders } from "../utils/cors.ts";

/**
 * Generate LinkedIn authorization URL
 */
export function getLinkedInAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  // Set up LinkedIn OAuth parameters with the required scopes
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: "r_liteprofile r_emailaddress rw_organization_admin rw_ads", 
    response_type: "code"
  });

  // Generate the authorization URL
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  return authUrl;
}

/**
 * Exchange authorization code for LinkedIn tokens
 */
export async function exchangeLinkedInToken(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<any> {
  try {
    // Prepare token request
    const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code
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
      console.error("LinkedIn token exchange error:", errorText);
      throw new Error(`LinkedIn API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Format token response to match our standard
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in || 86400 // Default to 24 hours if not specified
    };
  } catch (error) {
    console.error("Error exchanging LinkedIn token:", error);
    throw error;
  }
}
