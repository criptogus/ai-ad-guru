
// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Import platform-specific OAuth URL generators
import { getGoogleAuthUrl } from './platforms/google.ts';
import { getMetaAuthUrl } from './platforms/meta.ts';
import { getLinkedInAuthUrl } from './platforms/linkedin.ts';
import { getMicrosoftAuthUrl } from './platforms/microsoft.ts';
import { storeOAuthState } from "./utils/state.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request format"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { action, platform, userId, redirectUri } = requestBody;
    console.log(`Processing ${action} for ${platform} account, user: ${userId}`);
    
    // Generate OAuth URL
    if (action === 'getAuthUrl') {
      // Create a secure state parameter to validate the callback
      const stateParam = crypto.randomUUID();
      
      // Store the state with user information for validation during the callback
      const stateData = {
        userId,
        platform,
        redirectUri,
        created: new Date().toISOString()
      };
      
      // Store state in Supabase
      try {
        // Create Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
        const supabaseClient = await createSupabaseClient(supabaseUrl, supabaseServiceKey);
        
        await storeOAuthState(supabaseClient, stateParam, stateData);
      } catch (stateError) {
        console.error('Error storing OAuth state:', stateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to prepare OAuth flow. Try again later."
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Get platform specific variables
      let clientId;
      let authUrl;
      
      // Generate the proper OAuth URL for the specified platform
      if (platform === 'google') {
        clientId = Deno.env.get('GOOGLE_CLIENT_ID');
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Missing required Google Ads credentials"
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        authUrl = getGoogleAuthUrl(clientId, redirectUri, stateParam);
      } 
      else if (platform === 'meta') {
        clientId = Deno.env.get('META_CLIENT_ID');
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Missing required Meta Ads credentials"
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        authUrl = getMetaAuthUrl(clientId, redirectUri, stateParam);
      }
      else if (platform === 'linkedin') {
        clientId = Deno.env.get('LINKEDIN_CLIENT_ID');
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Missing required LinkedIn Ads credentials"
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        authUrl = getLinkedInAuthUrl(clientId, redirectUri, stateParam);
      }
      else if (platform === 'microsoft') {
        clientId = Deno.env.get('MICROSOFT_CLIENT_ID');
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "Missing required Microsoft Ads credentials"
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        authUrl = getMicrosoftAuthUrl(clientId, redirectUri, stateParam);
      }
      else {
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
      
      console.log(`Generated ${platform} auth URL with redirect to: ${redirectUri}`);
      
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
    }
    
    // Exchange code for token (mock)
    if (action === 'exchangeToken') {
      const { code, state, platform, redirectUri } = requestBody;
      
      // Here we would normally validate the state parameter and exchange the code for tokens
      // For this implementation, we'll return a mock response
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          accountId: `${platform}-account-${crypto.randomUUID().substring(0, 8)}`,
          accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Test Account`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Invalid action specified: ${action}`
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error("Auth error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Authentication process failed: " + (error.message || "Unknown error")
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Helper function to create Supabase client
async function createSupabaseClient(url: string, key: string) {
  const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.23.0");
  return createClient(url, key);
}
