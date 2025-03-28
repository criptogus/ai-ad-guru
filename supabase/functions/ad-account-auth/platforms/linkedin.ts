
// Generate LinkedIn OAuth URL
export const getLinkedInAuthUrl = (clientId: string, redirectUri: string, state: string) => {
  const scopes = [
    'r_liteprofile',
    'r_emailaddress',
    'w_member_social',
    'rw_ads'
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    state: state
  });
  
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
};

// Exchange code for token
export const exchangeLinkedInToken = async (
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string
) => {
  const tokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
  
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
    throw new Error(`LinkedIn token exchange failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    tokenType: data.token_type
  };
};
