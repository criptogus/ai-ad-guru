
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
  
  console.log(`Getting auth URL for platform: ${platform}, with redirect URI: ${redirectUri}`);
  
  // Validate required inputs
  if (!platform) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Missing required parameter: platform"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
  
  if (!redirectUri) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Missing required parameter: redirectUri"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
  
  if (!userId) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Missing required parameter: userId"
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
  
  // Check environment variables for the selected platform
  try {
    switch (platform) {
      case 'google': {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
        const developerToken = Deno.env.get('GOOGLE_DEVELOPER_TOKEN');
        
        console.log("Google credentials check:", 
          `Client ID: ${clientId ? 'Available' : 'Missing'}`, 
          `Client Secret: ${clientSecret ? 'Available' : 'Missing'}`,
          `Developer Token: ${developerToken ? 'Available' : 'Missing'}`);
        
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
        break;
      }
      
      case 'meta': {
        const clientId = Deno.env.get('META_CLIENT_ID');
        const clientSecret = Deno.env.get('META_CLIENT_SECRET');
        
        console.log("Meta credentials check:", 
          `Client ID: ${clientId ? 'Available' : 'Missing'}`, 
          `Client Secret: ${clientSecret ? 'Available' : 'Missing'}`);
        
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
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        break;
      }
      
      case 'linkedin': {
        const clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        const clientSecret = Deno.env.get('LINKEDIN_CLIENT_SECRET');
        
        console.log("LinkedIn credentials check:", 
          `Client ID: ${clientId ? 'Available' : 'Missing'}`, 
          `Client Secret: ${clientSecret ? 'Available' : 'Missing'}`);
        
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
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        break;
      }
      
      case 'microsoft': {
        const clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
        const clientSecret = Deno.env.get('MICROSOFT_CLIENT_SECRET');
        const developerToken = Deno.env.get('MICROSOFT_DEVELOPER_TOKEN');
        
        console.log("Microsoft credentials check:", 
          `Client ID: ${clientId ? 'Available' : 'Missing'}`, 
          `Client Secret: ${clientSecret ? 'Available' : 'Missing'}`,
          `Developer Token: ${developerToken ? 'Available' : 'Missing'}`);
        
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
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        break;
      }
      
      default:
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
    
    // Generate the appropriate auth URL
    let authUrl: string | null = null;
    try {
      if (platform === 'google') {
        const clientId = Deno.env.get('GOOGLE_CLIENT_ID')!;
        authUrl = getGoogleAuthUrl(clientId, redirectUri, stateParam);
      } else if (platform === 'meta') {
        const metaClientId = Deno.env.get('META_CLIENT_ID')!;
        authUrl = getMetaAuthUrl(metaClientId, redirectUri, stateParam);
      } else if (platform === 'linkedin') {
        const linkedInClientId = Deno.env.get('LINKEDIN_CLIENT_ID')!;
        authUrl = getLinkedInAuthUrl(linkedInClientId, redirectUri, stateParam);
      } else if (platform === 'microsoft') {
        const microsoftClientId = Deno.env.get('MICROSOFT_CLIENT_ID')!;
        authUrl = getMicrosoftAuthUrl(microsoftClientId, redirectUri, stateParam);
      }
      
      if (!authUrl) {
        throw new Error(`Failed to generate auth URL for ${platform}`);
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
    
    // Log the generated URL for debugging
    console.log(`Generated ${platform} auth URL successfully with redirect URI: ${redirectUri}`);
    
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
  } catch (generalError: any) {
    console.error("Unexpected error in getAuthUrl:", generalError);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unexpected error: ${generalError.message}` 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
};
