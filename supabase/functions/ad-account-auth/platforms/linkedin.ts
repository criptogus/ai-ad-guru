
// LinkedIn OAuth constants and authentication utilities
const LINKEDIN_OAUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_SCOPE = "r_liteprofile r_emailaddress w_member_social rw_ads";

export const getLinkedInAuthUrl = (clientId: string, redirectUri: string, stateParam: string) => {
  return `${LINKEDIN_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(LINKEDIN_SCOPE)}&response_type=code&state=${stateParam}`;
};

export const exchangeLinkedInToken = async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', clientId);
  tokenParams.append('client_secret', clientSecret);
  tokenParams.append('code', code);
  tokenParams.append('redirect_uri', redirectUri);
  tokenParams.append('grant_type', 'authorization_code');

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`LinkedIn token exchange failed (${response.status}): ${errorText}`);
    throw new Error(`Failed to exchange code for LinkedIn tokens: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

export const getLinkedInAccountId = async (accessToken: string) => {
  try {
    // Get LinkedIn user profile to get the account ID
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.warn('Failed to retrieve LinkedIn profile:', errorText);
      return 'retrieval-error';
    }
    
    const profileData = await profileResponse.json();
    let accountId = profileData.id || 'unknown';
    
    // Try to get ad accounts if available
    try {
      const adAccountsResponse = await fetch('https://api.linkedin.com/v2/adAccountsV2?q=search&search.account.reference-locale.language=en&search.account.reference-locale.country=US', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      
      if (adAccountsResponse.ok) {
        const adAccountsData = await adAccountsResponse.json();
        if (adAccountsData.elements && adAccountsData.elements.length > 0) {
          // Use the first ad account's ID
          accountId = adAccountsData.elements[0].id || accountId;
        }
      }
    } catch (adAccountError) {
      console.error('Error retrieving LinkedIn ad accounts:', adAccountError);
      // Continue with just the profile ID
    }
    
    return accountId;
  } catch (error) {
    console.error('Error retrieving LinkedIn account info:', error);
    return 'error-retrieving';
  }
};
