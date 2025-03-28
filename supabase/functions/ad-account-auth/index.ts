
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
import { storeOAuthState, validateOAuthState } from "./utils/state.ts";
import { exchangeToken, saveUserTokens } from "./utils/token-exchange.ts";

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
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    let supabaseClient;
    
    try {
      const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.23.0");
      supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Internal server error: Database connection failed" 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Generate OAuth URL
    if (action === 'getAuthUrl') {
      // Validate required parameters
      if (!platform || !userId || !redirectUri) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Missing required parameters: platform, userId, or redirectUri" 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
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
      try {
        clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
        if (!clientId) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `Missing required ${platform.toUpperCase()}_CLIENT_ID`
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        if (platform === 'google') {
          authUrl = getGoogleAuthUrl(clientId, redirectUri, stateParam);
        } else if (platform === 'meta') {
          authUrl = getMetaAuthUrl(clientId, redirectUri, stateParam);
        } else if (platform === 'linkedin') {
          authUrl = getLinkedInAuthUrl(clientId, redirectUri, stateParam);
        } else if (platform === 'microsoft') {
          authUrl = getMicrosoftAuthUrl(clientId, redirectUri, stateParam);
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
      } catch (error) {
        console.error(`Error generating ${platform} auth URL:`, error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to generate authorization URL: ${error.message}`
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.log(`Generated ${platform} auth URL with redirect to: ${redirectUri}`);
      
      // FIXED: Using authUrl instead of url property in the response
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
    
    // Exchange code for token and save user connection
    if (action === 'exchangeToken') {
      const { code, state } = requestBody;
      
      if (!code || !state) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Missing required parameters: code or state"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      try {
        // Validate the state and get stored data
        const stateData = await validateOAuthState(supabaseClient, state);
        const { userId, platform, redirectUri } = stateData;
        
        // Exchange the code for tokens
        const tokens = await exchangeToken(platform, code, redirectUri);
        
        // Save the tokens to the database
        const connection = await saveUserTokens(supabaseClient, userId, platform, tokens);
        
        // Get account information (mock for now, can be implemented later)
        const accountInfo = {
          id: connection.id,
          platform: connection.platform,
          accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
          connectedAt: new Date().toISOString()
        };
        
        return new Response(
          JSON.stringify({ 
            success: true,
            connection: accountInfo
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (error) {
        console.error('Error exchanging token:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Authentication error: ${error.message}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    }
    
    // Remove connection
    if (action === 'removeConnection') {
      const { connectionId, userId } = requestBody;
      
      if (!connectionId || !userId) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Missing required parameters: connectionId or userId"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
      
      try {
        // Remove the connection from the database
        const { error } = await supabaseClient
          .from('user_integrations')
          .delete()
          .eq('id', connectionId)
          .eq('user_id', userId);
        
        if (error) {
          throw new Error(`Failed to remove connection: ${error.message}`);
        }
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: "Connection successfully removed"
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (error) {
        console.error('Error removing connection:', error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Failed to remove connection: ${error.message}`
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
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
