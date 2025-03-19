
// Microsoft OAuth constants and authentication utilities
const MICROSOFT_OAUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
const MICROSOFT_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
const MICROSOFT_SCOPE = "offline_access https://ads.microsoft.com/msads.manage";

export const getMicrosoftAuthUrl = (clientId: string, redirectUri: string, stateParam: string) => {
  return `${MICROSOFT_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(MICROSOFT_SCOPE)}&response_type=code&state=${stateParam}`;
};

export const exchangeMicrosoftToken = async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', clientId);
  tokenParams.append('client_secret', clientSecret);
  tokenParams.append('code', code);
  tokenParams.append('redirect_uri', redirectUri);
  tokenParams.append('grant_type', 'authorization_code');

  const response = await fetch(MICROSOFT_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Microsoft token exchange failed (${response.status}): ${errorText}`);
    throw new Error(`Failed to exchange code for Microsoft tokens: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

export const getMicrosoftAccountId = async (accessToken: string) => {
  const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
  
  if (!developerToken) {
    console.warn('Microsoft developer token not configured');
    return 'developer-token-missing';
  }
  
  try {
    // Get Microsoft Ads accounts
    const msAdsUrl = 'https://api.ads.microsoft.com/v13/customer-management/accounts';
    
    const accountsResponse = await fetch(msAdsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'DeveloperToken': developerToken
      }
    });
    
    if (!accountsResponse.ok) {
      const errorText = await accountsResponse.text();
      console.warn('Failed to retrieve Microsoft Ads accounts:', errorText);
      return 'retrieval-error';
    }
    
    const accountsData = await accountsResponse.json();
    if (accountsData.value && accountsData.value.length > 0) {
      // Use the first account's ID
      return accountsData.value[0].Id.toString() || 'unknown';
    } else {
      return 'no-accounts';
    }
  } catch (error) {
    console.error('Error retrieving Microsoft Ads account info:', error);
    return 'error-retrieving';
  }
};
