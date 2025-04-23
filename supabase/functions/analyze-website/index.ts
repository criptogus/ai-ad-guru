
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";
import { fetchWebsiteData } from "./websiteDataFetcher.ts";
import { CacheHandler } from "./cacheHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get Supabase credentials for caching
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    let cacheHandler;
    if (supabaseUrl && supabaseKey) {
      cacheHandler = new CacheHandler(supabaseUrl, supabaseKey);
    }

    // Parse request body
    const { url } = await req.json();
    console.log('Analyzing URL:', url);

    // Check cache first if available
    if (cacheHandler) {
      const cacheResult = await cacheHandler.checkCache(url);
      if (cacheResult.fromCache) {
        console.log('Cache hit for URL:', url);
        return new Response(
          JSON.stringify({ 
            success: true, 
            data: cacheResult.data,
            fromCache: true, 
            cachedAt: cacheResult.cachedAt,
            expiresAt: cacheResult.expiresAt 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // If not in cache, fetch website data
    const websiteData = await fetchWebsiteData(url);
    console.log('Website data fetched. Title:', websiteData.title);

    // Create OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const prompt = `
    You are an expert business and marketing analyst. Analyze this website content and extract key business information.
    Use the website's original language in your response.

    Title: ${websiteData.title}
    Description: ${websiteData.description}
    Keywords: ${websiteData.keywords}
    Content: ${websiteData.visibleText.slice(0, 6500)}
    URL: ${websiteData.url}

    Extract and provide:
    1. Company Name
    2. Business Description (2-3 sentences)
    3. Target Audience
    4. Brand Tone/Voice
    5. Unique Selling Points (3-5 points)
    6. Keywords for Advertising (5-7 keywords)
    7. Call-to-Action Suggestions (3 variations)

    Return ONLY a JSON object with these exact fields:
    {
      "companyName": "string",
      "businessDescription": "string",
      "targetAudience": "string",
      "brandTone": "string",
      "uniqueSellingPoints": ["string"],
      "keywords": ["string"],
      "callToAction": ["string"]
    }
    
    Do not include any other text in your response, just the JSON.
    If you can't determine a value, use a reasonable guess based on the industry.
    `;

    console.log("Sending request to OpenAI...");
    
    // Make the OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    // Parse the response and ensure it's valid JSON
    let analysisResult;
    try {
      analysisResult = JSON.parse(completion.choices[0].message.content);
      console.log('Analysis completed successfully');
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      console.log('Raw response:', completion.choices[0].message.content);
      
      // Attempt to extract JSON from response if it's wrapped in other text
      const jsonMatch = completion.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          analysisResult = JSON.parse(jsonMatch[0]);
          console.log('Successfully extracted JSON from response');
        } catch (e) {
          throw new Error('Failed to extract valid JSON from OpenAI response');
        }
      } else {
        throw new Error('OpenAI response did not contain valid JSON');
      }
    }
    
    // Validate result has the expected structure
    if (!analysisResult.companyName || !analysisResult.businessDescription) {
      console.warn('OpenAI response missing some required fields', analysisResult);
      
      // Try to fill in missing values
      analysisResult.companyName = analysisResult.companyName || extractCompanyName(websiteData.title);
      analysisResult.businessDescription = analysisResult.businessDescription || 
        "Business description not detected. Please update manually.";
    }
    
    // Ensure arrays are actually arrays
    ['uniqueSellingPoints', 'keywords', 'callToAction'].forEach(field => {
      if (!Array.isArray(analysisResult[field])) {
        analysisResult[field] = analysisResult[field] ? 
          [analysisResult[field]] : 
          [`${field.charAt(0).toUpperCase() + field.slice(1)} not detected. Please update manually.`];
      }
    });
    
    // Store in cache if available
    if (cacheHandler) {
      await cacheHandler.cacheResult(url, analysisResult);
    }

    // Return the analysis result
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: analysisResult,
        fromCache: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unknown error occurred"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to extract company name from title if needed
function extractCompanyName(title: string): string {
  // Remove common title suffixes
  let name = title.replace(/\s*[|]\s*.+$/, '')
                 .replace(/\s*[-]\s*.+$/, '')
                 .replace(/\s*[–]\s*.+$/, '')
                 .replace(/\s*[:]\s*.+$/, '');
                 
  // Further clean up if needed
  if (name.length > 50) {
    name = name.substring(0, 50);
  }
  
  return name || "Company name not detected";
}
