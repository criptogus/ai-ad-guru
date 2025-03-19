
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";
import { corsHeaders, handleCorsRequest } from "./utils/cors.ts";
import { getAuthUrl } from "./actions/getAuthUrl.ts";
import { exchangeToken } from "./actions/exchangeToken.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsRequest(req);
  if (corsResponse) return corsResponse;

  try {
    // Create the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase URL or service role key");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Server configuration error"
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
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
    
    const { action } = requestBody;
    
    // Generate OAuth URL
    if (action === 'getAuthUrl') {
      return await getAuthUrl(supabaseClient, requestBody);
    }
    
    // Exchange code for token
    if (action === 'exchangeToken') {
      return await exchangeToken(supabaseClient, requestBody);
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
    
  } catch (error: any) {
    console.error(`Error processing request:`, error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
