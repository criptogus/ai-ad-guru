
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { createAudienceAnalysisPrompt } from "./promptCreator.ts";
import { WebsiteData } from "./utils.ts";

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
    const { websiteData, platform, language = 'pt' } = await req.json();
    
    console.log(`Analyzing audience for website with language: ${language}`);
    console.log(`Platform requested: ${platform || 'all'}`);
    console.log(`Website data received:`, JSON.stringify(websiteData, null, 2));
    
    if (!websiteData) {
      throw new Error("Website data is required for audience analysis");
    }
    
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY")
    });
    
    // Create the prompt for audience analysis
    const prompt = createAudienceAnalysisPrompt(websiteData as WebsiteData, platform, language);
    
    console.log("Sending request to OpenAI...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using gpt-4o for better results
      messages: [
        { role: "system", content: "You are a senior marketing and business analyst AI providing detailed audience, market, and competitor analysis specifically for the country context provided. Respond in the language specified by the user. Ensure all geographic recommendations are relevant to the specified country (usually Brazil)." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });
    
    const analysisText = response.choices[0].message.content;
    console.log("Received response from OpenAI");
    
    if (!analysisText || analysisText.length < 100) {
      throw new Error("OpenAI returned an invalid or too short analysis");
    }
    
    console.log(`OpenAI response length: ${analysisText.length}`);
    console.log(`First 500 chars of response: ${analysisText.substring(0, 500)}...`);
    
    // Return the raw analysis result from OpenAI
    return new Response(
      JSON.stringify({
        success: true,
        data: analysisText,
        websiteUrl: websiteData.websiteUrl,
        rawWebsiteData: websiteData // Include the raw website data for debugging
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in audience analysis:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
