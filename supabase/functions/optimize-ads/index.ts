
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateWithOpenAI } from "../generate-ads/openai.ts";

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
    const { ads, platform, performance, optimizationGoal } = await req.json();
    
    if (!ads || !platform) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Ads and platform are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Optimizing ${platform} ads with performance data:`, performance);
    console.log(`Optimization goal: ${optimizationGoal || 'improve CTR'}`);
    
    // Generate optimization prompt based on platform and performance data
    let optimizationPrompt = "";
    
    if (platform === 'google') {
      optimizationPrompt = createGoogleAdOptimizationPrompt(ads, performance, optimizationGoal);
    } else if (platform === 'meta' || platform === 'instagram') {
      optimizationPrompt = createMetaAdOptimizationPrompt(ads, performance, optimizationGoal);
    } else if (platform === 'linkedin') {
      optimizationPrompt = createLinkedInAdOptimizationPrompt(ads, performance, optimizationGoal);
    } else if (platform === 'microsoft') {
      optimizationPrompt = createMicrosoftAdOptimizationPrompt(ads, performance, optimizationGoal);
    } else {
      throw new Error('Unsupported platform');
    }
    
    console.log("Generated optimization prompt:", optimizationPrompt);
    
    // Generate optimized ad variants with OpenAI
    const response = await generateWithOpenAI(optimizationPrompt);
    console.log("OpenAI response:", response);
    
    // Parse the AI response to extract optimized ads
    const optimizedAds = parseOptimizationResponse(response, platform);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: optimizedAds,
        original: {
          ads,
          performance,
          optimizationGoal
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error("Error optimizing ads:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An error occurred while optimizing ads' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper functions to generate optimization prompts for different platforms
function createGoogleAdOptimizationPrompt(ads, performance, optimizationGoal) {
  const goal = optimizationGoal || "improve CTR and conversion rate";
  
  return `You are an expert in Google Ads optimization. 
Analyze the following Google Search Ads and their performance data, then rewrite them to ${goal}.

CURRENT ADS:
${JSON.stringify(ads, null, 2)}

PERFORMANCE DATA:
${JSON.stringify(performance, null, 2)}

Create 3 optimized versions of each ad that address the performance issues and improve results.
Focus on stronger headlines, more compelling descriptions, and clearer calls to action.

For each ad, provide:
1. Three optimized headline variations
2. Two optimized description variations
3. A brief explanation of what you improved and why

Format your response as valid JSON with this structure:
{
  "optimizedAds": [
    {
      "originalAdIndex": 0,
      "headlines": ["New Headline 1", "New Headline 2", "New Headline 3"],
      "descriptions": ["New Description 1", "New Description 2"],
      "rationale": "Explanation of changes and expected impact"
    }
  ]
}`;
}

function createMetaAdOptimizationPrompt(ads, performance, optimizationGoal) {
  const goal = optimizationGoal || "improve engagement and conversion rate";
  
  return `You are an expert in Meta/Instagram Ads optimization. 
Analyze the following Meta ads and their performance data, then rewrite them to ${goal}.

CURRENT ADS:
${JSON.stringify(ads, null, 2)}

PERFORMANCE DATA:
${JSON.stringify(performance, null, 2)}

Create 2 optimized versions of each ad that address the performance issues and improve results.
Focus on more engaging primary text, stronger headlines, and more compelling descriptions.

For each ad, provide:
1. Two optimized primary text variations
2. Two optimized headline variations  
3. Two optimized description variations
4. An improved image prompt (if applicable)
5. A brief explanation of what you improved and why

Format your response as valid JSON with this structure:
{
  "optimizedAds": [
    {
      "originalAdIndex": 0,
      "primaryText": ["New Primary Text 1", "New Primary Text 2"],
      "headline": ["New Headline 1", "New Headline 2"],
      "description": ["New Description 1", "New Description 2"],
      "imagePrompt": "Improved image generation prompt",
      "rationale": "Explanation of changes and expected impact"
    }
  ]
}`;
}

function createLinkedInAdOptimizationPrompt(ads, performance, optimizationGoal) {
  const goal = optimizationGoal || "improve engagement with business professionals";
  
  // Using same format as Meta since we're reusing the LinkedIn format
  return createMetaAdOptimizationPrompt(ads, performance, goal);
}

function createMicrosoftAdOptimizationPrompt(ads, performance, optimizationGoal) {
  const goal = optimizationGoal || "improve CTR and conversion rate";
  
  // Using same format as Google since Microsoft ads use similar format
  return createGoogleAdOptimizationPrompt(ads, performance, goal);
}

// Helper function to parse the optimization response from OpenAI
function parseOptimizationResponse(response, platform) {
  try {
    // Try to parse the response as JSON directly
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}') + 1;
    const jsonStr = response.substring(jsonStart, jsonEnd);
    const parsedResponse = JSON.parse(jsonStr);
    
    // Validate the expected structure
    if (!parsedResponse.optimizedAds || !Array.isArray(parsedResponse.optimizedAds)) {
      throw new Error("Invalid response format: optimizedAds array is missing");
    }
    
    return parsedResponse.optimizedAds;
  } catch (error) {
    console.error("Error parsing optimization response:", error);
    
    // Fallback: Return a structured error message
    return [
      {
        originalAdIndex: 0,
        error: "Failed to parse optimization response",
        rawResponse: response
      }
    ];
  }
}
