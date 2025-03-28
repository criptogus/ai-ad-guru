
// Generate Meta (Facebook) OAuth URL
export const getMetaAuthUrl = (clientId: string, redirectUri: string, state: string) => {
  const scopes = [
    'ads_management',
    'ads_read',
    'public_profile',
    'email',
    'business_management'
  ].join(',');
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    state: state
  });
  
  return `https://www.facebook.com/v16.0/dialog/oauth?${params.toString()}`;
};

// Exchange code for token
export const exchangeMetaToken = async (
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
) => {
  const tokenUrl = 'https://graph.facebook.com/v16.0/oauth/access_token';
  
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri
  });
  
  const response = await fetch(`${tokenUrl}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Meta token exchange failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
    tokenType: 'bearer'
  };
};
