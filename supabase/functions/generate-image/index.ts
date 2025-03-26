
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateImageWithGPT4o, downloadImage } from "./imageGenerator.ts";
import { saveGeneratedImage } from "./databaseHandler.ts";
import { storeImageInSupabase } from "./storageHandler.ts";
import { corsHeaders } from "./utils.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Get the request body
    const requestData = await req.json();
    
    // Extract the required parameters
    const {
      prompt,
      imageFormat = "square", // Default to square format
      platform = "instagram", // Default to instagram
      userId,
      templateId,
      campaignId,
      mainText,
      subText
    } = requestData;

    // Validate the required parameters
    if (!prompt) {
      throw new Error("Missing required parameter: prompt");
    }

    // Get environment variables
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are not properly set");
    }

    console.log(`Generating image for platform: ${platform}, format: ${imageFormat}`);
    
    // Generate the image using OpenAI
    const { url: originalImageUrl, revisedPrompt } = await generateImageWithGPT4o({
      prompt,
      imageFormat,
      openaiApiKey,
      mainText,
      subText,
      templateId
    });

    // Store a persistent copy in Supabase Storage
    const imageBlob = await downloadImage(originalImageUrl);
    const persistentImageUrl = await storeImageInSupabase(imageBlob, {
      supabaseUrl,
      supabaseServiceKey
    });
    
    // Save the image record to the database if a user ID is provided
    let finalImageUrl = persistentImageUrl;
    if (userId) {
      finalImageUrl = await saveGeneratedImage({
        imageUrl: persistentImageUrl,
        prompt,
        userId,
        templateId,
        campaignId,
        supabaseUrl,
        supabaseKey: supabaseServiceKey
      });
    }

    // Return the success response
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: finalImageUrl,
        revisedPrompt,
        originalUrl: originalImageUrl
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    
    // Return the error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
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
