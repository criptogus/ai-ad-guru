
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY is not configured in environment variables" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }

  try {
    const { websiteInfo, platform } = await req.json();
    
    console.log("Generating campaign setup data for:", platform);
    console.log("Using website info:", websiteInfo);
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert digital advertising assistant that helps users create effective ad campaigns.
Based on the provided website information, generate a complete campaign setup for ${platform} ads.`;

    const userPrompt = `Please create a complete campaign setup based on this information:
    
Company: ${websiteInfo.companyName}
Description: ${websiteInfo.businessDescription}
Target Audience: ${websiteInfo.targetAudience}
Brand Tone: ${websiteInfo.brandTone}
Keywords: ${websiteInfo.keywords.join(', ')}
Call To Actions: ${websiteInfo.callToAction.join(', ')}
Unique Selling Points: ${websiteInfo.uniqueSellingPoints.join(', ')}

Generate the following:
1. A creative campaign name
2. A concise campaign description
3. A specific target audience description
4. Relevant keywords (comma separated)
5. A reasonable daily budget (between $20-$100)
6. The most appropriate campaign objective (awareness, consideration, conversion)
7. A start date (from tomorrow)
8. An end date (optional, 30 days from start)
9. A recommended optimization frequency (daily, 3days, weekly, or manual)

Format your response as a valid JSON object with these fields:
{
  "name": "Campaign name",
  "description": "Campaign description",
  "targetAudience": "Target audience description",
  "keywords": "keyword1, keyword2, keyword3",
  "budget": 50,
  "objective": "conversion",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "optimizationFrequency": "daily"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
    });
    
    const content = response.choices[0].message.content;
    console.log("OpenAI response:", content);
    
    // Extract and parse the JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const data = JSON.parse(jsonString);
      
      // Ensure dates are in the correct format
      if (data.startDate) {
        // Ensure it's a valid date string
        data.startDate = new Date(data.startDate).toISOString();
      }
      
      if (data.endDate) {
        // Ensure it's a valid date string
        data.endDate = new Date(data.endDate).toISOString();
      }
      
      console.log("Parsed data:", data);
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse AI response", 
          rawResponse: content 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-campaign-setup function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
