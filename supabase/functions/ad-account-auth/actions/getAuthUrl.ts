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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } else if (platform === 'meta') {
    const clientSecret = Deno.env.get('META_CLIENT_SECRET');
    
    console.log("Meta credentials available:", 
      `Client ID: ${Deno.env.get('META_CLIENT_ID') ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`);
    
    if (!Deno.env.get('META_CLIENT_ID') || !clientSecret) {
      const missingVars = [];
      if (!Deno.env.get('META_CLIENT_ID')) missingVars.push('META_CLIENT_ID');
      if (!clientSecret) missingVars.push('META_CLIENT_SECRET');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required Meta Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } else if (platform === 'linkedin') {
    const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
    
    console.log("LinkedIn credentials available:", 
      `Client ID: ${Deno.env.get('LINKEDIN_CLIENT_ID') ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`);
    
    if (!Deno.env.get('LINKEDIN_CLIENT_ID') || !clientSecret) {
      const missingVars = [];
      if (!Deno.env.get('LINKEDIN_CLIENT_ID')) missingVars.push('LINKEDIN_CLIENT_ID');
      if (!clientSecret) missingVars.push('LINKEDIN_CLIENT_SECRET');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required LinkedIn Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
  } else if (platform === 'microsoft') {
    const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
    const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
    
    console.log("Microsoft credentials available:", 
      `Client ID: ${Deno.env.get('MICROSOFT_CLIENT_ID') ? 'Yes' : 'No'}`, 
      `Client Secret: ${clientSecret ? 'Yes' : 'No'}`,
      `Developer Token: ${developerToken ? 'Yes' : 'No'}`);
    
    if (!Deno.env.get('MICROSOFT_CLIENT_ID') || !clientSecret || !developerToken) {
      const missingVars = [];
      if (!Deno.env.get('MICROSOFT_CLIENT_ID')) missingVars.push('MICROSOFT_CLIENT_ID');
      if (!clientSecret) missingVars.push('MICROSOFT_CLIENT_SECRET');
      if (!developerToken) missingVars.push('MICROSOFT_DEVELOPER_TOKEN');
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Missing required Microsoft Ads credentials: ${missingVars.join(', ')}`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
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
    console.error("Failed to store OAuth state:", error);
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
  
  let authUrl: string | null = null;
  try {
    if (platform === 'google') {
      authUrl = getGoogleAuthUrl(clientId!, redirectUri, stateParam);
    } else if (platform === 'meta') {
      const metaClientId = Deno.env.get('META_CLIENT_ID');
      authUrl = getMetaAuthUrl(metaClientId!, redirectUri, stateParam);
    } else if (platform === 'linkedin') {
      const linkedInClientId = Deno.env.get('LINKEDIN_CLIENT_ID');
      authUrl = getLinkedInAuthUrl(linkedInClientId!, redirectUri, stateParam);
    } else if (platform === 'microsoft') {
      const microsoftClientId = Deno.env.get('MICROSOFT_CLIENT_ID');
      authUrl = getMicrosoftAuthUrl(microsoftClientId!, redirectUri, stateParam);
    }
  } catch (error: any) {
    console.error(`Error generating ${platform} auth URL:`, error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to generate auth URL: ${error.message}` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
  
  // Enhanced logging to debug auth URL generation
  console.log(`Generated ${platform} auth URL:`, authUrl ? 'URL generated successfully' : 'FAILED TO GENERATE URL');
  if (authUrl) {
    console.log(`Redirect URI used: ${redirectUri}`);
  } else {
    console.error(`Failed to generate auth URL for ${platform}`);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to generate valid authentication URL for ${platform}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      authUrl
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
};
