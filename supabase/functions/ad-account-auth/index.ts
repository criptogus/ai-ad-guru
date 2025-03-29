
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
      return await getAuthUrl(supabaseClient, requestData);
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
