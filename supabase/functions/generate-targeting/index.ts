
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.6.0";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { businessDescription, targetAudience, keywordsCount = 5 } = await req.json();
    
    console.log(`Generating targeting recommendations with input: ${JSON.stringify({
      businessDescription,
      targetAudience,
      keywordsCount
    }, null, 2)}`);

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const prompt = `
    Based on the following business description and target audience, provide targeting recommendations for digital advertising campaigns.

    Business Description: ${businessDescription}
    
    Target Audience: ${targetAudience}
    
    Please provide:
    1. A language code (e.g., en, es, pt)
    2. A country code (e.g., US, UK, BR)
    3. An age range (e.g., 18-24, 25-54)
    4. Gender targeting (e.g., all, male, female)
    5. Top ${keywordsCount} specific locations (cities or regions)
    6. Top ${keywordsCount} interests or keywords for targeting
    
    Format your response as a JSON object with the following structure:
    {
      "language": "en",
      "country": "US",
      "ageRange": "25-54",
      "gender": "all",
      "locations": "New York, Los Angeles, Chicago, Miami, Seattle",
      "interests": "fitness, nutrition, wellness, yoga, meditation"
    }`;
    
    console.log("Sending request to OpenAI...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a digital marketing specialist that provides targeting recommendations for advertising campaigns." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });
    
    const responseText = response.choices[0].message.content;
    console.log(`Raw OpenAI response: ${responseText}`);
    
    try {
      const targetingData = JSON.parse(responseText);
      console.log(`Successfully parsed OpenAI response as JSON: ${JSON.stringify(targetingData, null, 2)}`);
      
      return new Response(JSON.stringify(targetingData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return new Response(JSON.stringify({ 
        error: "Failed to parse AI response", 
        rawResponse: responseText 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("Error generating targeting recommendations:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
