
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
    
    console.log("[DALLE] Generating image with prompt:", prompt.substring(0, 150) + "...");
    console.log("[DALLE] Additional info:", JSON.stringify(additionalInfo || {}, null, 2));
    
    // Extract format and additional context from additionalInfo
    const format = additionalInfo?.format || 'square';
    const industry = additionalInfo?.industry || '';
    const brandName = additionalInfo?.brandName || additionalInfo?.companyName || '';
    const adType = additionalInfo?.adType || 'instagram';
    const language = additionalInfo?.language || 'portuguese'; // Default to Portuguese
    
    // Determine image size based on format
    let size = "1024x1024"; // Default square format
    if (format === 'story' || format === 'reel') {
      size = "1024x1792"; // Vertical/portrait format for stories
    } else if (format === 'landscape') {
      size = "1792x1024"; // Landscape format
    }
    
    console.log(`[DALLE] Generating image with size: ${size} for format: ${format}`);
    
    // Ensure prompt is in Portuguese
    let enhancedPrompt = prompt;
    
    // Add language context if not specified
    if (!prompt.toLowerCase().includes('português') && language === 'portuguese') {
      enhancedPrompt = `[CRIAR EM PORTUGUÊS BRASILEIRO] ${prompt}`;
    }
    
    // Add brand and industry context if available
    if (brandName) {
      enhancedPrompt += ` Marca: ${brandName}.`;
    }
    
    if (industry) {
      enhancedPrompt += ` Indústria: ${industry}.`;
    }
    
    // Final instructions for the image (explicitly in Portuguese)
    enhancedPrompt += ` Crie uma imagem profissional e de alta qualidade para anúncio de ${adType} em formato ${format}. A imagem deve ter composição excelente sem texto. NÃO INCLUA NENHUM TEXTO NA IMAGEM.`;
    
    console.log("[DALLE] Enhanced prompt:", enhancedPrompt);
    
    // Validate OpenAI API Key
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    
    const openai = new OpenAI({
      apiKey: apiKey,
    });
    
    console.log("[DALLE] Calling OpenAI API with model dall-e-3");
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: size as "1024x1024" | "1024x1792" | "1792x1024",
      style: "natural",
      quality: "hd",
      response_format: "url"
    });
    
    console.log("[DALLE] OpenAI response received:", JSON.stringify(response, null, 2));
    
    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }
    
    console.log("[DALLE] Image generated successfully:", imageUrl.substring(0, 50) + "...");
    
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
    console.error("[DALLE] Error in generate-image-gpt4o function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
