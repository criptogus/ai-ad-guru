
// Generate Microsoft (Bing Ads) OAuth URL
export const getMicrosoftAuthUrl = (clientId: string, redirectUri: string, state: string) => {
  const scopes = [
    'offline_access',
    'https://ads.microsoft.com/msads.manage',
    'openid',
    'email',
    'profile'
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    state: state
  });
  
  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
};

// Exchange code for token
export const exchangeMicrosoftToken = async (
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
) => {
  const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  });
  
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  
  if (!response.ok) {
    throw new Error(`Microsoft token exchange failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type
  };
};
