
// Generate Google OAuth URL with proper Google Ads API scopes
export const getGoogleAuthUrl = (clientId: string, redirectUri: string, state: string) => {
  const scopes = [
    'https://www.googleapis.com/auth/adwords',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    state: state,
    prompt: 'consent' // Always prompt for consent to ensure we get refresh tokens
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Exchange code for token
export const exchangeGoogleToken = async (
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
) => {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });
  
  console.log(`Exchanging code for token with redirect URI: ${redirectUri}`);
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google token exchange failed (${response.status}):`, errorText);
    throw new Error(`Google token exchange failed: ${response.status} - ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type
  };
};

// Verify access to Google Ads API
export const verifyGoogleAdsAccess = async (accessToken: string, developerToken: string) => {
  try {
    const response = await fetch('https://googleads.googleapis.com/v15/customers:listAccessibleCustomers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Ads API verification failed (${response.status}):`, errorText);
      return { 
        verified: false, 
        error: `API access verification failed: ${response.status} - ${response.statusText}` 
      };
    }

    const data = await response.json();
    const accounts = data.resourceNames || [];
    
    return { 
      verified: true, 
      accountCount: accounts.length,
      accounts: accounts
    };
  } catch (error) {
    console.error('Error verifying Google Ads API access:', error);
    return { 
      verified: false, 
      error: error instanceof Error ? error.message : 'Unknown error during API access verification'
    };
  }
};

// Get Google Ads manager accounts (duplicative with verifyGoogleAdsAccess but kept for compatibility)
export const getGoogleAdsAccounts = async (accessToken: string, developerToken: string) => {
  try {
    const response = await fetch('https://googleads.googleapis.com/v15/customers:listAccessibleCustomers', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Ads API request failed (${response.status}):`, errorText);
      throw new Error(`Google Ads API request failed: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.resourceNames;
  } catch (error) {
    console.error('Error fetching Google Ads accounts:', error);
    throw error;
  }
};
