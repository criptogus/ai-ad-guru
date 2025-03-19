
import { corsHeaders } from "../utils/cors.ts";
import { retrieveOAuthState, cleanupOAuthState } from "../utils/state.ts";
import { storeTokens } from "../utils/token.ts";
import { exchangeGoogleToken, getGoogleAccountId } from "../platforms/google.ts";
import { exchangeLinkedInToken, getLinkedInAccountId } from "../platforms/linkedin.ts";
import { exchangeMicrosoftToken, getMicrosoftAccountId } from "../platforms/microsoft.ts";

export const exchangeToken = async (
  supabaseClient: any,
  requestBody: any
) => {
  const { code, state } = requestBody;
  
  if (!code) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Authorization code is required"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Validate state parameter to prevent CSRF attacks
  if (!state) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "State parameter is missing"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Retrieve and validate the state
  let stateData;
  try {
    stateData = await retrieveOAuthState(supabaseClient, state);
  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Invalid or expired OAuth state"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Use the stored data from the state
  const { userId, platform, redirectUri } = stateData;
  
  // Clean up the used state
  await cleanupOAuthState(supabaseClient, state);
  
  let clientId, clientSecret;
  
  if (platform === 'google') {
    clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    console.log("Google credentials available:", !!clientId, !!clientSecret);
  } else if (platform === 'linkedin') {
    clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    console.log("LinkedIn credentials available:", !!clientId, !!clientSecret);
  } else if (platform === 'microsoft') {
    clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
    clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    console.log("Microsoft credentials available:", !!clientId, !!clientSecret);
  }
  
  if (!clientId || !clientSecret) {
    console.error(`${platform} OAuth credentials not configured`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `${platform} OAuth credentials not configured in server environment`
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  try {
    // Exchange the code for tokens
    let tokenData;
    if (platform === 'google') {
      tokenData = await exchangeGoogleToken(code, clientId, clientSecret, redirectUri);
    } else if (platform === 'linkedin') {
      tokenData = await exchangeLinkedInToken(code, clientId, clientSecret, redirectUri);
    } else if (platform === 'microsoft') {
      tokenData = await exchangeMicrosoftToken(code, clientId, clientSecret, redirectUri);
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    console.log('Token exchange successful');
    
    // Retrieve account information based on platform
    let accountId = '';
    
    if (platform === 'google') {
      accountId = await getGoogleAccountId(tokenData.access_token);
    } else if (platform === 'linkedin') {
      accountId = await getLinkedInAccountId(tokenData.access_token);
    } else if (platform === 'microsoft') {
      accountId = await getMicrosoftAccountId(tokenData.access_token);
    }
    
    // Calculate token expiration (if provided by the platform)
    let expiresAt = null;
    if (tokenData.expires_in) {
      expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
    }
    
    // Store the tokens in Supabase
    await storeTokens(
      supabaseClient,
      userId,
      platform,
      tokenData.access_token,
      tokenData.refresh_token || null,
      accountId,
      expiresAt
    );
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully connected to ${platform === 'google' ? 'Google' : platform === 'linkedin' ? 'LinkedIn' : 'Microsoft'} Ads`,
        accountId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(`Error during token exchange:`, error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Token exchange failed"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
