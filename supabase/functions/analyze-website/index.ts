
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { scrapeWebsite } from "./websiteScraper.ts";
import { analyzeWebsiteWithAI } from "./aiAnalyzer.ts";
import { CacheHandler } from "./cacheHandler.ts";

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
    const { url, checkCacheOnly, userId } = await req.json();
    
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

    // First check if we have a cached result for this URL (valid for 30 days)
    const cachedResult = await cacheHandler.checkCache(url);
    
    if (cachedResult.fromCache) {
      console.log("Using cached analysis result");
      
      // If this is just a cache check, return the cache status
      if (checkCacheOnly) {
        return new Response(JSON.stringify({
          success: true,
          exists: true,
          fromCache: true,
          cachedAt: cachedResult.cachedAt,
          expiresAt: cachedResult.expiresAt
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      
      // Return the cached data with cache info
      return new Response(JSON.stringify({
        success: true,
        data: cachedResult.data,
        fromCache: true,
        cachedAt: cachedResult.cachedAt,
        expiresAt: cachedResult.expiresAt
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // If this is just a cache check and no cache exists, return that info
    if (checkCacheOnly) {
      return new Response(JSON.stringify({
        success: true,
        exists: false
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    
    // No cache found, perform the actual analysis
    console.log("No cache found, performing fresh analysis");

    // Get the OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    // Step 1: Scrape the website content
    console.log(`Scraping website: ${url}`);
    const websiteData = await scrapeWebsite(url);
    if (!websiteData) {
      throw new Error('Failed to scrape website data');
    }

    // Step 2: Analyze the content with OpenAI
    console.log("Analyzing website content with OpenAI");
    const analysisResult = await analyzeWebsiteWithAI(websiteData, openaiApiKey);
    
    // Step 3: Cache the analysis result (valid for 30 days)
    console.log("Caching analysis result for future use");
    await cacheHandler.cacheResult(url, analysisResult);
    
    // Step 4: Return the result
    return new Response(JSON.stringify({
      success: true,
      data: analysisResult,
      fromCache: false
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error(`Error in analyze-website function:`, error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
