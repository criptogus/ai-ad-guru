
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchWebsiteData } from "./websiteDataFetcher.ts";
import { analyzeWebsiteWithAI } from "./aiAnalyzer.ts";
import { corsHeaders, handleResponse } from "./utils.ts";
import { CacheHandler } from "./cacheHandler.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY is not set');
      return handleResponse({ 
        success: false, 
        error: "OpenAI API key is not configured" 
      }, 500);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase configuration missing');
      return handleResponse({ 
        success: false, 
        error: "Database connection failed" 
      }, 500);
    }
    
    // Initialize cache handler
    const cacheHandler = new CacheHandler(supabaseUrl, supabaseKey);
    console.log("OpenAI API key found, length:", openaiApiKey.length);

    // Parse request body
    const requestData = await req.json();
    const { url } = requestData;
    
    if (!url) {
      return handleResponse({ 
        success: false, 
        error: "URL is required" 
      }, 400);
    }

    console.log(`Analyzing website: ${url}`);

    // Check cache first
    const { data: cachedResult, fromCache, cachedAt } = await cacheHandler.checkCache(url);
    
    // If we have a valid cached result, return it
    if (cachedResult && fromCache) {
      return handleResponse({ 
        success: true, 
        data: cachedResult,
        fromCache: true,
        cachedAt
      }, 200);
    }

    // Step 1: Fetch website content
    let websiteData;
    try {
      websiteData = await fetchWebsiteData(url);
      console.log("Successfully fetched website data");
    } catch (error) {
      console.error("Error fetching website data:", error);
      return handleResponse({
        success: false,
        error: `Failed to fetch website data: ${error.message || "Unknown error"}`
      }, 500);
    }

    // Step 2: Analyze website with OpenAI
    try {
      console.log("Analyzing website data with OpenAI...");
      const websiteAnalysis = await analyzeWebsiteWithAI(websiteData, openaiApiKey);
      
      console.log("Website analysis completed successfully");
      
      // Cache the analysis result
      await cacheHandler.cacheResult(url, websiteAnalysis, websiteAnalysis.language);
      
      return handleResponse({ success: true, data: websiteAnalysis }, 200);
    } catch (openAiError) {
      console.error("OpenAI API error:", openAiError);
      return handleResponse({ 
        success: false, 
        error: `Error communicating with AI service: ${openAiError.message || "Unknown error"}`,
        details: JSON.stringify(openAiError)
      }, 500);
    }
  } catch (error) {
    console.error("Error in analyze-website function:", error.message);
    return handleResponse({ 
      success: false, 
      error: error.message || "An error occurred while analyzing the website" 
    }, 500);
  }
});
