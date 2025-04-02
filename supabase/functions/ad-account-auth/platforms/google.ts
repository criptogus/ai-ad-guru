
// Google OAuth implementation

/**
 * Generate Google OAuth URL with the required scopes for Google Ads access
 */
export function getGoogleAuthUrl(clientId: string, redirectUri: string, state: string): string {
  // Define the scopes needed for Google Ads access
  const scopes = [
    'https://www.googleapis.com/auth/adwords',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];
  
  // Build the authorization URL
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  // Add required parameters
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');
  
  // Add state parameter for security (CSRF protection)
  authUrl.searchParams.append('state', state);
  
  // Add optional parameters
  authUrl.searchParams.append('include_granted_scopes', 'true');
  
  console.log(`Generated Google OAuth URL with state: ${state}`);
  return authUrl.toString();
}

/**
 * Exchange Google authorization code for access and refresh tokens
 */
export async function exchangeGoogleToken(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  console.log('Exchanging Google auth code for tokens with redirect URI:', redirectUri);
  
  // Build the token request
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }).toString()
  });
  
  if (!tokenResponse.ok) {
    let errorText = await tokenResponse.text();
    console.error('Google token exchange failed:', errorText);
    let errorDetails = 'Token exchange failed';
    
    try {
      const errorData = JSON.parse(errorText);
      errorDetails = errorData.error_description || errorData.error || errorDetails;
    } catch (e) {
      // If not JSON, use the text as is
    }
    
    throw new Error(`Google OAuth error: ${errorDetails}`);
  }
  
  // Parse the token response
  const tokenData = await tokenResponse.json();
  
  if (!tokenData.access_token) {
    throw new Error('No access token returned from Google');
  }
  
  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token || '',
    expiresIn: tokenData.expires_in || 3600
  };
}

/**
 * Verify if the user has access to Google Ads
 */
export async function verifyGoogleAdsAccess(
  accessToken: string,
  developerToken: string
): Promise<{ 
  verified: boolean; 
  error?: string;
  accounts?: string[];
  accountCount?: number;
}> {
  if (!developerToken) {
    console.warn('Google Ads developer token not provided');
    return { 
      verified: false, 
      error: 'Missing Google Ads developer token'
    };
  }
  
  try {
    console.log('Verifying Google Ads API access');
    
    // Try to list accessible customers to verify Google Ads access
    const response = await fetch('https://googleads.googleapis.com/v15/customers:listAccessibleCustomers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Ads API access verification failed:', errorText);
      
      let errorDetails = 'Access verification failed';
      try {
        const errorData = JSON.parse(errorText);
        errorDetails = errorData.error?.message || errorData.error || errorDetails;
      } catch (e) {
        // If not JSON, use the text as is
      }
      
      return { 
        verified: false,
        error: `Google Ads API error: ${errorDetails}`
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
      error: error instanceof Error ? error.message : 'Unknown error verifying Google Ads access'
    };
  }
}
