
export function getGoogleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email', 
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/adwords'
  ].join(' ');
  
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scopes);
  url.searchParams.append('access_type', 'offline');
  url.searchParams.append('prompt', 'consent');
  url.searchParams.append('state', state);
  
  return url.toString();
}

export async function exchangeGoogleToken(
  clientId: string, 
  clientSecret: string, 
  code: string, 
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
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
      console.error('Google token exchange error:', errorText);
      throw new Error(`Google token exchange failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token || '',
      expiresIn: data.expires_in || 3600
    };
  } catch (error) {
    console.error('Exception in exchangeGoogleToken:', error);
    throw error;
  }
}

export async function verifyGoogleAdsAccess(
  accessToken: string, 
  developerToken: string
): Promise<{ 
  verified: boolean; 
  error?: string; 
  accounts?: string[];
  accountCount?: number;
}> {
  try {
    if (!developerToken) {
      return {
        verified: false,
        error: 'Missing Google Ads developer token'
      };
    }
    
    // Call the Google Ads API to list accessible customers
    const response = await fetch(
      'https://googleads.googleapis.com/v15/customers:listAccessibleCustomers',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': developerToken
        }
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Ads API error:', errorText);
      return {
        verified: false,
        error: `Google Ads API error: ${response.status} - ${errorText}`
      };
    }
    
    const data = await response.json();
    const accounts = data.resourceNames || [];
    
    return {
      verified: true,
      accounts,
      accountCount: accounts.length
    };
  } catch (error) {
    console.error('Error verifying Google Ads access:', error);
    return {
      verified: false,
      error: `Exception: ${error.message}`
    };
  }
}
