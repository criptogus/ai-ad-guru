
// Google OAuth constants and authentication utilities
const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPE = "https://www.googleapis.com/auth/adwords";

export const getGoogleAuthUrl = (clientId: string, redirectUri: string, stateParam: string) => {
  return `${GOOGLE_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(GOOGLE_SCOPE)}&response_type=code&state=${stateParam}&access_type=offline&prompt=consent`;
};

export const exchangeGoogleToken = async (code: string, clientId: string, clientSecret: string, redirectUri: string) => {
  const tokenParams = new URLSearchParams();
  tokenParams.append('client_id', clientId);
  tokenParams.append('client_secret', clientSecret);
  tokenParams.append('code', code);
  tokenParams.append('redirect_uri', redirectUri);
  tokenParams.append('grant_type', 'authorization_code');

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: tokenParams.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google token exchange failed (${response.status}): ${errorText}`);
    throw new Error(`Failed to exchange code for Google tokens: ${response.status} - ${errorText}`);
  }

  return await response.json();
};

export const getGoogleAccountId = async (accessToken: string) => {
  const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
  let accountId = '';
  
  if (!developerToken) {
    console.warn('Google developer token not configured');
    return 'developer-token-missing';
  }
  
  try {
    const googleAdsUrl = 'https://googleads.googleapis.com/v14/customers:listAccessibleCustomers';
    const customerResponse = await fetch(googleAdsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken,
      }
    });
    
    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();
      console.warn('Failed to retrieve Google Ads customer info:', errorText);
      return 'retrieval-error';
    }
    
    const customerData = await customerResponse.json();
    if (customerData.resourceNames && customerData.resourceNames.length > 0) {
      // Extract the customer ID from the resource name (format: customers/1234567890)
      accountId = customerData.resourceNames[0].split('/')[1] || 'unknown';
    } else {
      accountId = 'no-accounts';
    }
    
    return accountId;
  } catch (error) {
    console.error('Error retrieving Google Ads account info:', error);
    return 'error-retrieving';
  }
};
