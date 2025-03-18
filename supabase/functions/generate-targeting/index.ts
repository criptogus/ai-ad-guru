
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { businessDescription, targetAudience, keywords, brandTone, uniqueSellingPoints } = await req.json();

    console.log('Generating targeting recommendations with input:', { 
      businessDescription, 
      targetAudience,
      keywordsCount: keywords?.length 
    });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: openAIApiKey,
    });

    // Create a prompt for OpenAI
    const prompt = `
      Based on the following business information, provide optimal advertising targeting parameters:

      Business Description: ${businessDescription || ''}
      Target Audience: ${targetAudience || ''}
      Keywords: ${keywords?.join(', ') || ''}
      Brand Tone: ${brandTone || ''}
      Unique Selling Points: ${uniqueSellingPoints?.join(', ') || ''}

      As an advertising targeting expert, recommend specific values for the following targeting parameters:
      
      1. Language (language code from common web languages like "en", "es", "fr", etc.)
      2. Country (country code like "US", "CA", "UK", etc.)
      3. Age Range (pick one: "18-24", "25-34", "35-44", "45-54", "55-64", "65+", or "18-65+")
      4. Gender (pick one: "all", "male", or "female")
      5. Locations (specific cities, states or regions, comma separated)
      6. Interests (for Meta Ads behavioral targeting, comma separated)

      Return ONLY a JSON object with these fields and NO additional text. Format as valid JSON like this:
      {"language": "en", "country": "US", "ageRange": "25-34", "gender": "all", "locations": "New York, Los Angeles, Chicago", "interests": "technology, innovation, smartphones"}
    `;

    console.log('Sending request to OpenAI...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    console.log('Received response from OpenAI');
    const targetingText = response.choices[0].message.content;
    console.log('Raw OpenAI response:', targetingText);
    
    try {
      // Extract JSON from the response
      const targetingData = JSON.parse(targetingText);
      console.log('Successfully parsed OpenAI response as JSON');
      
      return new Response(
        JSON.stringify({
          success: true,
          data: targetingData,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
      
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON:", error);
      console.error("Raw response:", targetingText);
      throw new Error(`Failed to parse targeting data: ${error.message}`);
    }

  } catch (error) {
    console.error('Error in generate-targeting function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
