
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.6.0";
import { CacheHandler } from "./cacheHandler.ts";
import { createAudienceAnalysisPrompt } from "./promptCreator.ts";
import { parseAnalysisResponse } from "./responseParser.ts";
import { corsHeaders, createErrorResponse, WebsiteData } from "./utils.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return createErrorResponse("OpenAI API key not configured", 500);
  }

  // Initialize cache handler for caching audience analysis results
  const cacheHandler = new CacheHandler(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { websiteData, platform, language } = await req.json();
    
    if (!websiteData) {
      return createErrorResponse("Website data is required", 400);
    }

    // Ensure websiteData has the language property, defaulting to 'en' if not provided
    websiteData.language = language || websiteData.language || 'en';
    
    const websiteUrl = websiteData.websiteUrl || "";
    const cacheKey = `${websiteUrl}:${platform || 'all'}:${websiteData.language}`;
    console.log(`Analyzing audience for ${platform || 'all platforms'} using website with URL: ${websiteUrl} in language: ${websiteData.language}`);
    
    // Check cache first if we have a valid URL
    if (websiteUrl) {
      const { data: cachedResult, fromCache, cachedAt } = await cacheHandler.checkCache(cacheKey);
      
      // If we have a valid cached result, return it
      if (cachedResult && fromCache) {
        return new Response(JSON.stringify({
          ...cachedResult,
          fromCache: true,
          cachedAt
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Create a prompt based on the provided website data and language
    const prompt = createAudienceAnalysisPrompt(websiteData as WebsiteData, platform, websiteData.language);
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    // Send request to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using a smaller model for cost efficiency
      messages: [
        { role: "system", content: "You are a media strategist and audience analysis expert specializing in creating targeting recommendations for digital ad campaigns." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response and extract structured data
    const analysisResult = parseAnalysisResponse(response.choices[0].message.content, platform);
    
    // Add language information to result
    analysisResult.language = websiteData.language;
    
    // Cache the analysis result if we have a URL
    if (websiteUrl) {
      await cacheHandler.cacheResult(cacheKey, analysisResult);
    }
    
    // Return the analysis result
    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error generating audience analysis:", error);
    return createErrorResponse(error.message, 500);
  }
});
