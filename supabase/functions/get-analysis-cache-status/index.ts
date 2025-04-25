
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { CacheHandler } from "../analyze-website/cacheHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url) {
      return new Response(JSON.stringify({
        success: false,
        error: "URL is required"
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Initialize the cache handler with Supabase connection info
    const cacheHandler = new CacheHandler(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Check if we have a cached result for this URL
    const cachedResult = await cacheHandler.checkCache(url);
    
    if (cachedResult.fromCache) {
      return new Response(JSON.stringify({
        success: true,
        exists: true,
        cachedAt: cachedResult.cachedAt,
        expiresAt: cachedResult.expiresAt
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({
        success: true,
        exists: false
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

  } catch (error) {
    console.error(`Error in get-analysis-cache-status function:`, error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
