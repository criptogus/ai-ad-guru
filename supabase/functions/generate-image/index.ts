
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { storeImageInSupabase } from "./storageHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, platform = 'meta', format = 'square', brandTone = 'professional' } = await req.json();
    
    console.log(`Generating image for prompt: ${prompt}`);
    console.log(`Platform: ${platform}, Format: ${format}, Brand Tone: ${brandTone}`);

    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Image prompt is required" 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Call OpenAI API to generate image
    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: format === 'story' ? '1024x1792' : '1024x1024',
        quality: 'standard',
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }

    const openaiData = await openaiResponse.json();
    const imageUrl = openaiData.data[0].url;
    
    console.log("OpenAI image generated successfully, downloading...");

    // Download the generated image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error("Failed to download generated image");
    }

    const imageBlob = await imageResponse.blob();
    
    console.log("Image downloaded, uploading to Supabase storage...");

    // Upload to Supabase storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const persistentImageUrl = await storeImageInSupabase(imageBlob, {
      supabaseUrl,
      supabaseServiceKey
    });

    console.log("Image processing completed successfully");
    console.log("Final image URL:", persistentImageUrl);

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrl: persistentImageUrl 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in generate-image function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while generating the image" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
