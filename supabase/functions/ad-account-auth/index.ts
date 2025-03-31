
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { getAuthUrl } from './actions/getAuthUrl.ts';
import { exchangeToken } from './actions/exchangeToken.ts';
import { corsHeaders } from './utils/cors.ts';

// Define allowed actions for better security
const ALLOWED_ACTIONS = ['getAuthUrl', 'exchangeToken'];

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Only allow POST requests for better security
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({
        success: false,
        error: `Method ${req.method} not allowed. Use POST instead.`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      });
    }

    // Parse request body
    const requestData = await req.json();
    const { action } = requestData;

    // Validate that action is provided
    if (!action) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Action is required'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Validate that action is allowed
    if (!ALLOWED_ACTIONS.includes(action)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Action '${action}' not allowed`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create Supabase client for database operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          persistSession: false
        }
      }
    );

    // Handle the getAuthUrl action
    if (action === 'getAuthUrl') {
      const { platform, redirectUri, userId } = requestData;
      
      // Validate required fields
      if (!platform) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Platform is required'
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
            error: 'Redirect URI is required'
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
            error: 'User ID is required'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      console.log(`Processing getAuthUrl for ${platform} account, user: ${userId}`);
      
      // Generate state parameter
      const state = crypto.randomUUID();
      
      // Store auth state in the database for verification
      try {
        // Store state in database
        const { error } = await supabaseClient
          .from('oauth_states')
          .insert({
            id: state,
            user_id: userId,
            platform,
            redirect_uri: redirectUri,
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
          });
        
        if (error) {
          console.error('OAuth state error:', error);
          return new Response(
            JSON.stringify({ success: false, error: `Failed to prepare OAuth flow: ${error.message}` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
          );
        }
      } catch (error) {
        console.error('Failed to store OAuth state:', error);
        return new Response(
          JSON.stringify({ success: false, error: `Failed to prepare OAuth flow: ${error.message}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      // Get platform credentials from environment
      const clientId = Deno.env.get(`${platform.toUpperCase()}_CLIENT_ID`);
      const clientSecret = Deno.env.get(`${platform.toUpperCase()}_CLIENT_SECRET`);
      
      if (!clientId || !clientSecret) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing API credentials for ${platform}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Generate a mock auth URL for testing
      // In a real implementation, this would call the platform's OAuth endpoint
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=profile%20email&state=${state}`;
      
      return new Response(
        JSON.stringify({ success: true, authUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    // Handle the exchangeToken action
    if (action === 'exchangeToken') {
      return await exchangeToken(supabaseClient, requestData);
    }
    
    // This should never happen due to validation above
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unknown action: ${action}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: `Server error: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
