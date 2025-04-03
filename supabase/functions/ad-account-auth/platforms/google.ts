
/**
 * Google Ads OAuth utilities
 */

export function getGoogleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  // Use specific scopes needed for Google Ads API
  const scopes = [
    'https://www.googleapis.com/auth/adwords',
    'email',
    'profile'
  ].join(' ');
  
  console.log(`Generating Google OAuth URL with clientId=${clientId ? 'present' : 'missing'} and redirect=${redirectUri}`);
  
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.append('client_id', clientId);
  url.searchParams.append('redirect_uri', redirectUri);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('scope', scopes);
  url.searchParams.append('access_type', 'offline');
  url.searchParams.append('prompt', 'consent'); // Force refresh token to be returned
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
    console.log('Exchanging Google token with:', { 
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasCode: !!code,
      redirectUri 
    });
    
    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials are not configured. Please check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
    }
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      }).toString()
    });
    
    // Always get response text first for better error logging
    const responseText = await tokenResponse.text();
    console.log(`Google token exchange response status: ${tokenResponse.status}`);
    
    if (!tokenResponse.ok) {
      throw new Error(`Google OAuth token exchange failed with status ${tokenResponse.status}: ${responseText}`);
    }
    
    // Parse JSON response
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error(`Failed to parse Google token response: ${error.message}`);
    }
    
    if (!data.access_token) {
      throw new Error('Google OAuth token exchange response did not include an access token');
    }
    
    console.log('Google token exchange successful');
    
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

// Verify Google Ads API access
export async function verifyGoogleAdsAccess(accessToken: string, developerToken: string): Promise<{ 
  verified: boolean; 
  accountCount?: number;
  accounts?: string[];
  error?: string;
}> {
  try {
    if (!developerToken) {
      return { 
        verified: false, 
        error: 'Google Ads Developer Token is not configured'
      };
    }
    
    // First get the customer ID list
    const response = await fetch('https://googleads.googleapis.com/v15/customers:listAccessibleCustomers', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Ads API error:', errorText);
      
      if (response.status === 403) {
        return {
          verified: false,
          error: 'Access denied. You may not have permission to access Google Ads API.'
        };
      }
      
      return {
        verified: false,
        error: `Google Ads API error: ${response.status} - ${errorText}`
      };
    }
    
    const data = await response.json();
    const accounts = data.resourceNames || [];
    
    return {
      verified: true,
      accountCount: accounts.length,
      accounts
    };
  } catch (error) {
    console.error('Error verifying Google Ads access:', error);
    return {
      verified: false,
      error: error.message
    };
  }
}
