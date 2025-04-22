
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
    
    // Extract format and additional context from additionalInfo
    const format = additionalInfo?.format || 'square';
    const industry = additionalInfo?.industry || '';
    const brandName = additionalInfo?.brandName || additionalInfo?.companyName || '';
    const adType = additionalInfo?.adType || 'instagram';
    
    // Determine image size based on format
    let size = "1024x1024"; // Default square format
    if (format === 'story' || format === 'reel') {
      size = "1024x1792"; // Vertical/portrait format for stories
    } else if (format === 'landscape') {
      size = "1792x1024"; // Landscape format
    }
    
    console.log(`Generating image with size: ${size} for format: ${format}`);
    
    // Enhance the prompt with context
    let enhancedPrompt = prompt;
    
    // Add brand and industry context if available
    if (brandName) {
      enhancedPrompt += ` Brand: ${brandName}.`;
    }
    
    if (industry) {
      enhancedPrompt += ` Industry: ${industry}.`;
    }
    
    // Final instructions for the image
    enhancedPrompt += ` The image should be a professional, high-quality advertisement suitable for an ${adType} post in ${format} format. Create a visually stunning image with excellent composition. Do not include any text in the image.`;
    
    console.log("Enhanced prompt:", enhancedPrompt);
    
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    });
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
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
        prompt,
        enhancedPrompt 
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
