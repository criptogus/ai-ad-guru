
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
    const { businessDescription, targetAudience, keywordsCount = 5, country = "BR" } = await req.json();
    
    console.log(`Generating targeting recommendations with input: ${JSON.stringify({
      businessDescription,
      targetAudience,
      keywordsCount,
      country
    }, null, 2)}`);

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const prompt = `
    Based on the following business description and target audience, provide targeting recommendations for digital advertising campaigns.
    IMPORTANT: This business operates in ${country === "BR" ? "Brazil" : country}. All recommendations should be specific to this country.

    Business Description: ${businessDescription || "Not provided"}
    
    Target Audience: ${targetAudience || "Not provided"}
    
    Please provide a complete analysis with the following information:
    1. A language code (e.g., pt for Portuguese, en for English)
    2. A country code (e.g., BR for Brazil, US for United States)
    3. An age range (e.g., 18-24, 25-54)
    4. Gender targeting (e.g., all, male, female)
    5. Top ${keywordsCount} specific locations within ${country === "BR" ? "Brazil" : country} (cities or regions)
    6. Top ${keywordsCount} interests or keywords for targeting
    7. Market Analysis: Provide a brief analysis of the current market trends relevant to this business
    8. Competitor Insights: Identify at least 3 potential competitors and their strengths/weaknesses
    
    Format your response as a JSON object with the following structure without any markdown formatting or code blocks:
    {
      "language": "pt",
      "country": "BR",
      "ageRange": "25-54",
      "gender": "all",
      "locations": ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre", "Brasília"],
      "interests": ["tecnologia", "inovação", "negócios", "produtividade", "marketing"],
      "marketAnalysis": "Detailed market analysis goes here with multiple paragraphs as needed.",
      "competitorInsights": "Detailed competitor insights go here with information about at least 3 competitors."
    }`;
    
    console.log("Sending request to OpenAI...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a digital marketing specialist that provides targeting recommendations for advertising campaigns in Brazil and other countries. You perform detailed market and competitor analysis. Respond ONLY with the JSON object requested, without any markdown formatting, explanation text, or code blocks." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    const responseText = response.choices[0].message.content;
    console.log(`Raw OpenAI response: ${responseText}`);
    
    try {
      // Clean the response text to handle markdown code blocks if present
      let jsonText = responseText.trim();
      
      // Remove markdown code block syntax if present
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/```json\n/, "").replace(/```$/, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/```\n/, "").replace(/```$/, "");
      }
      
      // Parse the cleaned JSON
      const targetingData = JSON.parse(jsonText);
      console.log(`Successfully parsed OpenAI response as JSON: ${JSON.stringify(targetingData, null, 2)}`);
      
      // Ensure consistent data structure and expand to include market analysis and competitor insights
      const formattedData = {
        language: targetingData.language || "pt",
        country: targetingData.country || "BR",
        ageRange: targetingData.ageRange || "25-54",
        gender: targetingData.gender || "all",
        locations: Array.isArray(targetingData.locations) ? targetingData.locations : 
                  [targetingData.locations || "No locations provided"],
        interests: Array.isArray(targetingData.interests) ? targetingData.interests :
                  [targetingData.interests || "No interests provided"],
        marketAnalysis: targetingData.marketAnalysis || "Análise de mercado não disponível. Por favor, tente novamente.",
        competitorInsights: targetingData.competitorInsights || "Informações sobre concorrentes não disponíveis. Por favor, tente novamente."
      };
      
      return new Response(JSON.stringify(formattedData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      
      // Attempt a more aggressive cleaning of the response
      try {
        // Try to extract JSON using regex - find anything that looks like a JSON object
        const jsonMatch = responseText.match(/{[\s\S]*}/);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          const targetingData = JSON.parse(extractedJson);
          console.log(`Successfully parsed extracted JSON: ${JSON.stringify(targetingData, null, 2)}`);
          
          return new Response(JSON.stringify(targetingData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } catch (secondError) {
        console.error("Error on second attempt to parse response:", secondError);
      }
      
      // If all parsing attempts fail, return the raw response for debugging
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
