import { corsHeaders } from "../utils/cors.ts";
import { storeOAuthState } from "../utils/state.ts";
import { getGoogleAuthUrl } from "../platforms/google.ts";
import { getMetaAuthUrl } from "../platforms/meta.ts";
import { getLinkedInAuthUrl } from "../platforms/linkedin.ts";
import { getMicrosoftAuthUrl } from "../platforms/microsoft.ts";

export const getAuthUrl = async (
  supabaseClient: any,
  requestBody: any
) => {
  const { platform, redirectUri, userId } = requestBody;
  
  console.log(`Using redirect URI: ${redirectUri}`);
  
  let clientId;
  
  // Check all required environment variables before proceeding
  if (platform === 'google') {
    clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
    
    console.log("Google credentials available:", 
      `Client ID: ${clientId ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`,
      `Developer Token: ${developerToken ? 'Yes' : 'No'}`);
    
    if (!clientId || !clientSecret || !developerToken) {
      const missingVars = [];
      if (!clientId) missingVars.push('GOOGLE_CLIENT_ID');
      if (!clientSecret) missingVars.push('GOOGLE_CLIENT_SECRET');
      if (!developerToken) missingVars.push('GOOGLE_DEVELOPER_TOKEN');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required Google Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } else if (platform === 'meta') {
    clientId = Deno.env.get('META_CLIENT_ID');
    const clientSecret = Deno.env.get('META_CLIENT_SECRET');
    
    console.log("Meta credentials available:", 
      `Client ID: ${clientId ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`);
    
    if (!clientId || !clientSecret) {
      const missingVars = [];
      if (!clientId) missingVars.push('META_CLIENT_ID');
      if (!clientSecret) missingVars.push('META_CLIENT_SECRET');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required Meta Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } else if (platform === 'linkedin') {
    clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    
    console.log("LinkedIn credentials available:", 
      `Client ID: ${clientId ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`);
    
    if (!clientId || !clientSecret) {
      const missingVars = [];
      if (!clientId) missingVars.push('LINKEDIN_CLIENT_ID');
      if (!clientSecret) missingVars.push('LINKEDIN_CLIENT_SECRET');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required LinkedIn Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } else if (platform === 'microsoft') {
    clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
    
    console.log("Microsoft credentials available:", 
      `Client ID: ${clientId ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`,
      `Developer Token: ${developerToken ? 'Yes' : 'No'}`);
    
    if (!clientId || !clientSecret || !developerToken) {
      const missingVars = [];
      if (!clientId) missingVars.push('MICROSOFT_CLIENT_ID');
      if (!clientSecret) missingVars.push('MICROSOFT_CLIENT_SECRET');
      if (!developerToken) missingVars.push('MICROSOFT_DEVELOPER_TOKEN');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required Microsoft Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  } else {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unsupported platform: ${platform}`
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Generate a unique state parameter to prevent CSRF
  const stateParam = crypto.randomUUID();
  
  // Store the state parameter with user ID temporarily
  const tempState = {
    userId,
    platform,
    redirectUri,
    created: new Date().toISOString()
  };
  
  // Store state in Supabase's oauth_states table
  try {
    await storeOAuthState(supabaseClient, stateParam, tempState);
  } catch (error: any) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to prepare OAuth flow"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
  
  let authUrl;
  if (platform === 'google') {
    authUrl = getGoogleAuthUrl(clientId, redirectUri, stateParam);
  } else if (platform === 'meta') {
    authUrl = getMetaAuthUrl(clientId, redirectUri, stateParam);
  } else if (platform === 'linkedin') {
    authUrl = getLinkedInAuthUrl(clientId, redirectUri, stateParam);
  } else if (platform === 'microsoft') {
    authUrl = getMicrosoftAuthUrl(clientId, redirectUri, stateParam);
  }
  
  console.log(`Generated ${platform} auth URL with redirect to: ${redirectUri}`);
  
  // Always use "authUrl" as the property name for consistency
  return new Response(
    JSON.stringify({ 
      success: true, 
      authUrl: authUrl // Explicitly use authUrl property name
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
};
