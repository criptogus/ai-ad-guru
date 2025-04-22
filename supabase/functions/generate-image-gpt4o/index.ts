
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imagePrompt, platform, format, adContext } = await req.json();
    
    if (!imagePrompt) {
      throw new Error("Image prompt is required");
    }
    
    console.log(`Generating image for ${platform} with format ${format}`);
    console.log("Prompt:", imagePrompt);
    
    // Check if we have the OpenAI API key
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set in the environment variables");
    }
    
    // Create an enhanced prompt that will generate better advertising imagery
    const enhancedPrompt = `Create a high-quality, professional advertising image for a ${platform} ad with the following details:

${imagePrompt}

The image should:
- Be in ${format || 'square'} format for ${platform} ads
- Have a clean, professional aesthetic with strategic negative space for text overlays (but NO TEXT in the image)
- Feature vibrant colors and professional composition
- Clearly convey the brand message without text
- Look like a premium stock photo or professional ad campaign image
- NOT contain any text, watermarks, or UI elements

Brand: ${adContext?.brandName || adContext?.companyName || ''}
Industry: ${adContext?.industry || ''}
Target audience: ${adContext?.targetAudience || ''}`;
    
    console.log("Enhanced prompt:", enhancedPrompt);
    
    // Call OpenAI's DALL-E 3 API
    const dalle3Response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: format === 'portrait' ? "1024x1792" : format === 'landscape' ? "1792x1024" : "1024x1024",
        quality: "standard",
        response_format: "url"
      })
    });
    
    // Check if the request was successful
    if (!dalle3Response.ok) {
      const errorData = await dalle3Response.json();
      console.error("DALL-E API Error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    // Parse the response
    const imageData = await dalle3Response.json();
    
    if (!imageData.data || !imageData.data[0] || !imageData.data[0].url) {
      throw new Error("No image URL in the response");
    }
    
    const imageUrl = imageData.data[0].url;
    console.log("Image generated successfully");
    
    // Return the image URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: imageUrl,
        format: format || 'square',
        platform: platform || 'meta'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in generate-image-gpt4o function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
