
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCorsRequest } from "./utils.ts";
import { enhancePrompt } from "./promptEnhancer.ts";
import { generateImageWithDallE, downloadImage } from "./imageGenerator.ts";
import { storeImageInSupabase, createErrorResponse } from "./storageHandler.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCorsRequest(req);
  if (corsResponse) return corsResponse;
  
  try {
    console.log("Starting image generation process...");
    
    // Get API keys from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials are not properly set');
    }

    // Parse request body
    const requestBody = await req.json();
    console.log("Request body:", JSON.stringify(requestBody, null, 2));
    
    const { 
      prompt, 
      brandTone, 
      companyName, 
      targetAudience, 
      uniqueSellingPoints,
      imageFormat = "square" // Default to square format (1024x1024)
    } = requestBody;
    
    if (!prompt) {
      throw new Error('Image prompt is required');
    }
    
    console.log(`Generating image with prompt: ${prompt}`);
    console.log(`Company: ${companyName}, Brand Tone: ${brandTone}`);
    console.log(`Image format: ${imageFormat}`);
    
    // Create enhanced prompt for DALL-E 3
    const enhancedPrompt = enhancePrompt({
      prompt,
      companyName,
      brandTone,
      targetAudience,
      uniqueSellingPoints
    });
    
    console.log("Enhanced prompt:", enhancedPrompt);
    
    // Generate image with DALL-E 3
    const { url: temporaryImageUrl, revisedPrompt } = await generateImageWithDallE({
      prompt: enhancedPrompt,
      imageFormat,
      openaiApiKey
    });
    
    // Download the image from OpenAI
    const imageBlob = await downloadImage(temporaryImageUrl);
    
    // Store the image in Supabase
    const persistentImageUrl = await storeImageInSupabase(imageBlob, {
      supabaseUrl,
      supabaseServiceKey
    });

    console.log("Image generation process completed successfully");
    console.log("Persistent image URL:", persistentImageUrl);

    // Return the persistent image URL and the revised prompt used by DALL-E
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: persistentImageUrl,
        prompt: enhancedPrompt,
        revisedPrompt: revisedPrompt || enhancedPrompt
      }), 
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
      }
    );
    
  } catch (error) {
    return createErrorResponse(error);
  }
});
