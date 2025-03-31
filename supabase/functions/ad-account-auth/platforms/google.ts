
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
