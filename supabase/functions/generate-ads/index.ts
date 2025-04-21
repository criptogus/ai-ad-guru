
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createOpenAIClient } from "./openai.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language } = await req.json();
    
    // Validate input data
    if (!prompt) {
      throw new Error("Prompt is required");
    }
    
    console.log(`Starting ad generation with language: ${language || 'default'}`);
    console.log(`Prompt preview: ${prompt.substring(0, 150)}...`);
    
    const openai = createOpenAIClient(Deno.env.get('OPENAI_API_KEY') || '');

    // System prompt reinforces quality and JSON format requirements
    const systemPrompt = "Você é um redator publicitário sênior premiado em Cannes e especialista em growth hacking. " +
      "Trabalha em uma agência criativa de alto padrão e domina estratégias para campanhas em Google Ads, Instagram, LinkedIn e Microsoft Ads. " +
      "Sua missão é criar anúncios que convertem, respeitando as limitações de cada plataforma e usando gatilhos mentais, " +
      "copywriting persuasivo e storytelling moderno. Responda SEMPRE no formato JSON especificado, sem texto adicional.";

    // Make the actual API call
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Nenhum conteúdo gerado pela API");
    }

    console.log("Content received from OpenAI API");
    
    // Log a small preview of the response for debugging
    console.log("Response preview:", content.substring(0, 200) + "...");

    try {
      // Try to parse the JSON response
      let parsedContent;
      
      // First attempt: direct JSON parse
      try {
        parsedContent = JSON.parse(content);
      } catch (jsonError) {
        console.log("Direct JSON parse failed, trying to extract JSON from text");
        
        // Second attempt: Try to extract JSON from the content if it's wrapped in markdown or other text
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          try {
            parsedContent = JSON.parse(jsonMatch[1].trim());
          } catch (extractedJsonError) {
            console.error("Failed to parse extracted JSON:", extractedJsonError);
            throw new Error("Invalid JSON format in extracted content");
          }
        } else {
          throw new Error("Could not extract JSON from response");
        }
      }
      
      // Validate the parsed content
      if (!parsedContent || typeof parsedContent !== 'object') {
        throw new Error("Invalid response format: Not a valid JSON object");
      }
      
      // Check that we have the expected ad content
      const hasGoogleAds = Array.isArray(parsedContent.google_ads) && parsedContent.google_ads.length > 0;
      const hasInstagramAds = Array.isArray(parsedContent.instagram_ads) && parsedContent.instagram_ads.length > 0;
      const hasLinkedInAds = Array.isArray(parsedContent.linkedin_ads) && parsedContent.linkedin_ads.length > 0;
      const hasMicrosoftAds = Array.isArray(parsedContent.microsoft_ads) && parsedContent.microsoft_ads.length > 0;
      
      // Ensure we have at least one type of ad
      if (!hasGoogleAds && !hasInstagramAds && !hasLinkedInAds && !hasMicrosoftAds) {
        throw new Error("Missing ad content in response");
      }
      
      console.log("Successfully parsed JSON response with ad content");
      
      // Return the successfully parsed content
      return new Response(
        JSON.stringify({ 
          success: true, 
          content: parsedContent,
          counts: {
            google: parsedContent.google_ads?.length || 0,
            instagram: parsedContent.instagram_ads?.length || 0,
            linkedin: parsedContent.linkedin_ads?.length || 0,
            microsoft: parsedContent.microsoft_ads?.length || 0
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      // Return both the error and the raw content for debugging
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Error parsing response: ${parseError.message}`,
          rawContent: content 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-ads function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
