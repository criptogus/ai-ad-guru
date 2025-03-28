
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../generate-image/utils.ts";

// Set up OpenAI API key
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    // Parse request body
    const requestData = await req.json();
    const { imagePrompt } = requestData;
    
    console.log("Received image generation request:", JSON.stringify({
      imagePrompt: imagePrompt?.substring(0, 100) + "...",
    }));
    
    if (!imagePrompt) {
      throw new Error('No image prompt provided');
    }
    
    // Enhance the prompt for better results
    let finalPrompt = imagePrompt + " High quality, photorealistic, detailed, professional photography style. Create a professional, high-quality Instagram ad image. The image should be visually striking with excellent lighting and composition.";
    
    console.log("Sending to OpenAI:", finalPrompt.substring(0, 100) + "...");
    
    // Call the OpenAI API with the DALL-E 3 model
    const openAIResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      })
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }
    
    const openAIData = await openAIResponse.json();
    
    if (!openAIData.data || !openAIData.data[0] || !openAIData.data[0].url) {
      throw new Error("No image URL in the response");
    }
    
    const imageUrl = openAIData.data[0].url;
    console.log("Successfully generated image URL");
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
        promptUsed: finalPrompt
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
    
  } catch (error) {
    console.error("Error generating image:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
