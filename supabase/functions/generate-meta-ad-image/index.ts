
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { prompt, format, userId, language = 'portuguese' } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Prompt is required" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Generating Meta ad image with prompt: ${prompt.substring(0, 100)}...`);
    console.log(`Format: ${format || 'default'}, User ID: ${userId || 'anonymous'}, Language: ${language}`);
    
    // Initialize OpenAI API
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    
    // Enhance prompt to ensure language consistency
    let enhancedPrompt = prompt;
    if (language === 'portuguese') {
      enhancedPrompt = `Por favor, crie uma imagem para anúncio profissional em português brasileiro: ${prompt}. A imagem deve ter estética de alta qualidade, adequada para campanhas de marketing digital.`;
    }
    
    // Determine image size based on format
    let size = "1024x1024"; // Default square format
    if (format === "landscape") {
      size = "1792x1024"; // Landscape format
    } else if (format === "portrait") {
      size = "1024x1792"; // Portrait format
    } else if (format === "story") {
      size = "1024x1792"; // Story format (similar to portrait)
    }
    
    // Call OpenAI API to generate image
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: size,
        quality: "standard",
        response_format: "url"
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const imageUrl = data.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }
    
    console.log("Image generated successfully, now saving to Supabase storage");
    
    // Save the generated image to Supabase Storage
    try {
      // Fetch the image
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase environment variables not set");
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Create a unique filename
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 12);
      const filename = `meta-ad-${timestamp}-${randomString}.png`;
      
      // Make sure the bucket exists
      const bucketName = "meta-ad-images";
      const { error: bucketError } = await supabase.storage.getBucket(bucketName);
      
      if (bucketError && bucketError.message.includes("not found")) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
        
        // Set policy to allow public access
        const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 60);
        if (policyError && !policyError.message.includes("not found")) {
          console.warn("Error setting bucket policy:", policyError);
        }
      }
      
      // Upload the image
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filename, imageBlob, {
          contentType: "image/png",
          cacheControl: "3600"
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      // Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);
      
      const persistentUrl = publicUrlData.publicUrl;
      
      console.log("Image saved successfully:", persistentUrl);
      
      // If a user ID was provided, save the image reference in the database
      if (userId) {
        const { error: dbError } = await supabase
          .from('generated_images')
          .insert({
            user_id: userId,
            image_url: persistentUrl,
            prompt_used: prompt,
            created_at: new Date().toISOString(),
            type: 'meta_ad'
          });
        
        if (dbError) {
          console.error("Error saving image reference to database:", dbError);
        }
      }
      
      // Return success response with both URLs
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: persistentUrl,
          originalUrl: imageUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (storageError) {
      console.error("Error saving to Supabase storage:", storageError);
      
      // Fallback: return the OpenAI URL directly
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: imageUrl,
          originalUrl: imageUrl,
          storageFailed: true,
          error: storageError.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "An unknown error occurred" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
