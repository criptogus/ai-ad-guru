
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  
  try {
    const { prompt, additionalInfo } = await req.json();
    
    if (!prompt) {
      throw new Error("Image prompt is required");
    }
    
    console.log("Generating image with prompt:", prompt);
    console.log("Additional info:", additionalInfo);
    
    // Extract format from additionalInfo for proper image generation
    const format = additionalInfo?.format || 'square';
    
    // Determine image size based on format
    let size = "1024x1024"; // Default square format
    if (format === 'story' || format === 'reel') {
      size = "1024x1792"; // Vertical/portrait format for stories
    } else if (format === 'landscape') {
      size = "1792x1024"; // Landscape format
    }
    
    console.log(`Generating image with size: ${size} for format: ${format}`);
    
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}. The image should be a professional, high-quality advertisement suitable for an ${additionalInfo?.adType || 'instagram'} post. Do not include any text in the image.`,
      n: 1,
      size: size as "1024x1024" | "1024x1792" | "1792x1024",
      style: "natural",
      quality: "hd",
      response_format: "url"
    });
    
    console.log("OpenAI response:", response);
    
    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        format,
        prompt 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in generate-image-gpt4o function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unexpected error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
