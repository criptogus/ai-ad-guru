
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import { OpenAI } from "https://esm.sh/openai@4.20.1";

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
    // Get OpenAI API key from environment variable
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Parse request body
    const { url } = await req.json();
    if (!url) {
      throw new Error('URL is required');
    }

    console.log(`Analyzing website: ${url}`);

    // Analyze website with OpenAI
    const prompt = `
    Analyze the following website: ${url}
    Extract:
    - companyName: Company Name
    - businessDescription: Business Description (short, 1-2 sentences)
    - targetAudience: Target Audience (who buys from them, be specific with demographics and interests)
    - brandTone: Brand Tone (e.g., friendly, professional, luxury)
    - keywords: Top 5 Keywords for Ads (list format)
    - callToAction: 3 Call-to-Action suggestions (short phrases)
    - uniqueSellingPoints: 3 Unique Selling Points (what makes them different)
    
    Return this in clean JSON format without any additional text or explanation.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const analysisText = response.choices[0].message.content;
    let websiteData;
    
    try {
      // Extract JSON from the response
      websiteData = JSON.parse(analysisText);
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON:", analysisText);
      throw new Error("Failed to parse website analysis data");
    }

    console.log("Website analysis completed successfully");

    // Return the analysis results
    return new Response(JSON.stringify({ success: true, data: websiteData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in analyze-website function:", error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while analyzing the website" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
