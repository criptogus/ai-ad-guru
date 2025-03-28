
// Meta OAuth constants and authentication utilities
const META_OAUTH_URL = "https://www.facebook.com/v20.0/dialog/oauth";
const META_TOKEN_URL = "https://graph.facebook.com/v20.0/oauth/access_token";
const META_SCOPE = "ads_management,ads_read,business_management";

export const getMetaAuthUrl = (clientId: string, redirectUri: string, stateParam: string) => {
  return `${META_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(META_SCOPE)}&response_type=code&state=${stateParam}`;
};

export const exchangeMetaToken = async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', clientId);
  tokenParams.append('client_secret', clientSecret);
  tokenParams.append('code', code);
  tokenParams.append('redirect_uri', redirectUri);
  tokenParams.append('grant_type', 'authorization_code');

  const response = await fetch(META_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Meta token exchange failed (${response.status}): ${errorText}`);
    throw new Error(`Failed to exchange code for Meta tokens: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

export const getMetaAccountId = async (accessToken: string) => {
  try {
    // Get ad accounts associated with the user
    const accountsUrl = `https://graph.facebook.com/v20.0/me/adaccounts?fields=name,id,account_status&access_token=${accessToken}`;
    const accountsResponse = await fetch(accountsUrl);
    
    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.warn('Failed to retrieve Meta ad accounts:', errorText);
      return 'retrieval-error';
    }
    
    const accountsData = await accountsResponse.json();
    if (accountsData.data && accountsData.data.length > 0) {
      // Use the first active ad account's ID
      const activeAccount = accountsData.data.find((account: any) => account.account_status === 1);
      if (activeAccount) {
        return activeAccount.id;
      } else {
        return accountsData.data[0].id; // Fall back to first account even if not active
      }
    } else {
      // If no ad accounts found, use user ID instead
      const userUrl = `https://graph.facebook.com/v20.0/me?access_token=${accessToken}`;
      const userResponse = await fetch(userUrl);
      
      if (!userResponse.ok) {
        return 'no-accounts';
      }
      
      const userData = await userResponse.json();
      return userData.id || 'unknown';
    }
  } catch (error) {
    console.error('Error retrieving Meta account info:', error);
    return 'error-retrieving';
  }
};
