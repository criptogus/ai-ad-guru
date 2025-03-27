
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchWebsiteData } from "./websiteDataFetcher.ts";
import { analyzeWebsiteWithAI } from "./aiAnalyzer.ts";
import { corsHeaders, handleResponse } from "./utils.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    
    const supabase = createClient(supabaseUrl, supabaseKey);
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

    // Check if we have a cached result for this URL (within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: cachedData, error: cacheError } = await supabase
      .from('website_analysis_cache')
      .select('*')
      .eq('url', url)
      .gte('created_at', thirtyDaysAgo.toISOString())
      .maybeSingle();
    
    if (cacheError) {
      console.error("Error checking cache:", cacheError);
      // Continue with analysis even if cache check fails
    }
    
    // If we have a valid cached result, return it
    if (cachedData && cachedData.analysis_result) {
      console.log("Using cached analysis result from:", cachedData.created_at);
      return handleResponse({ 
        success: true, 
        data: cachedData.analysis_result,
        fromCache: true,
        cachedAt: cachedData.created_at
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
      try {
        const { error: upsertError } = await supabase
          .from('website_analysis_cache')
          .upsert({
            url: url,
            analysis_result: websiteAnalysis,
            language: websiteAnalysis.language || 'en'
          }, { onConflict: 'url' });
        
        if (upsertError) {
          console.error("Error caching analysis result:", upsertError);
          // Continue even if caching fails
        } else {
          console.log("Analysis result cached successfully");
        }
      } catch (cacheError) {
        console.error("Error in cache operation:", cacheError);
        // Continue even if caching fails
      }
      
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
