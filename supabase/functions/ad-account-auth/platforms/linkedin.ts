
import { corsHeaders } from "../utils/cors.ts";

/**
 * Generate LinkedIn authorization URL
 */
export function getLinkedInAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string
): string {
  // Set up LinkedIn OAuth parameters with the required scopes for LinkedIn Ads API
  // Note: LinkedIn requires Marketing Developer Platform approval for advanced ad scopes
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: [
      'r_liteprofile',
      'r_emailaddress',
      'r_ads',
      'rw_ads',
      'r_ads_reporting',
      'r_organization_admin',
      'rw_organization_admin'
    ].join(' '), 
    response_type: "code"
  });

  console.log(`LinkedIn auth URL being generated with redirect URI: ${redirectUri}`);
  console.log(`LinkedIn OAuth state parameter: ${state}`);
  
  // Generate the authorization URL
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  console.log(`Complete LinkedIn auth URL: ${authUrl}`);
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
    console.log(`Exchanging LinkedIn code with redirect URI: ${redirectUri}`);
    
    // Prepare token request
    const tokenUrl = "https://www.linkedin.com/oauth/v2/accessToken";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code
    });
    
    console.log("LinkedIn token exchange parameters:", {
      clientIdLength: clientId ? clientId.length : 0,
      clientSecretPresent: !!clientSecret,
      code: code ? code.substring(0, 5) + "..." : "missing",
      redirectUri
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

    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse LinkedIn response as JSON:", responseText);
      throw new Error(`LinkedIn API returned non-JSON response: ${responseText}`);
    }

    if (!response.ok) {
      console.error("LinkedIn token exchange error:", data);
      console.error("LinkedIn token exchange status:", response.status);
      
      // Handle specific LinkedIn error messages
      if (data.error === 'access_denied') {
        throw new Error(`LinkedIn API error: ${data.error_description || data.error}`);
      }
      
      throw new Error(`LinkedIn API error: ${response.status} ${JSON.stringify(data)}`);
    }
    
    console.log("LinkedIn token exchange successful:", {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      expiresIn: data.expires_in
    });

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

/**
 * Validate LinkedIn Marketing Developer Platform access
 * This helps determine if the app has the necessary permissions
 */
export async function validateLinkedInAccess(accessToken: string): Promise<boolean> {
  try {
    // Test API call that requires Marketing Developer Platform permissions
    const response = await fetch('https://api.linkedin.com/v2/adAccountsV2?q=search&count=1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("LinkedIn API validation failed:", errorText);
      return false;
    }
    
    // If we get here, the access token has Marketing API permissions
    return true;
  } catch (error) {
    console.error("LinkedIn access validation error:", error);
    return false;
  }
}
