
export function getLinkedInAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const scopes = [
    'r_emailaddress',
    'r_liteprofile',
    'rw_ads',
    'r_ads',
    'r_ads_reporting',
    'r_organization_social',
    'rw_organization_admin'
  ].join(' ');
  
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
    console.log('Exchanging LinkedIn token with redirect URI:', redirectUri);
    
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }).toString()
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('LinkedIn token exchange error:', errorText);
      throw new Error(`LinkedIn token exchange failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
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
