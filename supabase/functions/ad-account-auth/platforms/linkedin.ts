
/**
 * LinkedIn Ads OAuth utilities
 */

export function getLinkedInAuthUrl(clientId: string, redirectUri: string, state: string): string {
  // Modified scopes to ensure we request exactly what we need for LinkedIn Ads
  const scopes = [
    'r_emailaddress',
    'r_liteprofile',
    'rw_ads',
    'r_ads',
    'r_ads_reporting',
    'r_organization_social',
    'rw_organization_admin'
  ].join(' ');
  
  console.log(`Generating LinkedIn OAuth URL with clientId=${clientId ? 'present' : 'missing'} and redirect=${redirectUri}`);
  
  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scopes);
  url.searchParams.append('state', state);
  
  return url.toString();
}

export async function exchangeLinkedInToken(
  clientId: string, 
  clientSecret: string, 
  code: string, 
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  try {
    console.log('Exchanging LinkedIn token with:', { 
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasCode: !!code,
      redirectUri 
    });
    
    if (!clientId || !clientSecret) {
      throw new Error('LinkedIn client credentials are not configured. Please check LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.');
    }
    
    if (!code) {
      throw new Error('Authorization code is missing from the request');
    }
    
    // Construct the request body for token exchange
    const requestBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }).toString();
    
    console.log(`Making POST request to LinkedIn OAuth token endpoint with redirect URI: ${redirectUri}`);
    
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: requestBody
    });
    
    // Instead of just checking response.ok, log more details for debugging
    const statusCode = response.status;
    const responseText = await response.text();
    
    console.log(`LinkedIn token exchange response status: ${statusCode}`);
    console.log(`LinkedIn token exchange response body: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    
    if (!response.ok) {
      throw new Error(`LinkedIn token exchange failed with status ${statusCode}: ${responseText}`);
    }
    
    // Parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing LinkedIn token response:', error);
      throw new Error(`Failed to parse LinkedIn response: ${error.message}`);
    }
    
    if (!data.access_token) {
      throw new Error('LinkedIn response did not include an access token');
    }
    
    console.log('LinkedIn token exchange successful');
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || '',
      expiresIn: data.expires_in || 3600
    };
  } catch (error) {
    console.error('Exception in exchangeLinkedInToken:', error);
    throw error;
  }
}

// Helper function to get LinkedIn profile information
export async function getLinkedInProfile(accessToken: string): Promise<any> {
  try {
    console.log('Getting LinkedIn profile with access token');
    
    const response = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LinkedIn profile API error: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting LinkedIn profile:', error);
    return null;
  }
}

// Function to get LinkedIn ad accounts
export async function getLinkedInAdAccounts(accessToken: string): Promise<any> {
  try {
    console.log('Getting LinkedIn ad accounts with access token');
    
    // First get organization accounts the user has access to
    const orgResponse = await fetch('https://api.linkedin.com/v2/organizationAcls?q=roleAssignee', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      }
    });
    
    if (!orgResponse.ok) {
      const errorText = await orgResponse.text();
      console.error('LinkedIn organizations API error:', errorText);
      
      // Return a simplified error response instead of throwing
      return { 
        elements: [],
        error: `LinkedIn API error (${orgResponse.status}): ${errorText}`
      };
    }
    
    const orgData = await orgResponse.json();
    console.log(`Found ${orgData.elements?.length || 0} LinkedIn organizations`);
    
    if (!orgData.elements || orgData.elements.length === 0) {
      return { elements: [] };
    }
    
    return { elements: orgData.elements };
  } catch (error) {
    console.error('Error getting LinkedIn ad accounts:', error);
    return { elements: [], error: error.message };
  }
}
