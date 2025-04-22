
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
    const requestData = await req.json();
    const { prompt, format, userId, language = 'portuguese' } = requestData;
    
    console.log("Request data:", {
      promptLength: prompt ? prompt.length : 0,
      format, 
      userId: userId ? "Present" : "Not provided",
      language
    });
    
    if (!prompt) {
      console.error("Missing prompt in request");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Prompt is required" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log(`Generating Meta ad image with prompt: ${prompt.substring(0, 100)}...`);
    
    // Initialize OpenAI API
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set");
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
    
    console.log("Using format:", format, "Size:", size);
    
    // Call OpenAI API to generate image
    console.log("Calling OpenAI API...");
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
    
    console.log("OpenAI API response status:", response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("OpenAI response data:", {
      dataReceived: !!data,
      hasData: !!data.data,
      firstItem: !!data.data?.[0],
      hasUrl: !!data.data?.[0]?.url
    });
    
    const imageUrl = data.data[0]?.url;
    
    if (!imageUrl) {
      console.error("No image URL returned from OpenAI");
      throw new Error("No image URL returned from OpenAI");
    }
    
    console.log("Image generated successfully, now saving to Supabase storage");
    
    // Save the generated image to Supabase Storage
    try {
      // Fetch the image
      console.log("Fetching image from OpenAI URL...");
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        console.error("Failed to fetch image from OpenAI:", imageResponse.status);
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      const imageBlob = await imageResponse.blob();
      console.log("Image blob size:", imageBlob.size);
      
      // Initialize Supabase client
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Supabase environment variables not set");
        throw new Error("Supabase environment variables not set");
      }
      
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      // Create a unique filename
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 12);
      const filename = `meta-ad-${timestamp}-${randomString}.png`;
      
      // Make sure the bucket exists
      const bucketName = "meta-ad-images";
      console.log("Checking bucket:", bucketName);
      
      const { error: bucketError } = await supabase.storage.getBucket(bucketName);
      
      if (bucketError && bucketError.message.includes("not found")) {
        console.log("Bucket does not exist, creating bucket:", bucketName);
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          console.error("Failed to create bucket:", createError);
          throw new Error(`Failed to create bucket: ${createError.message}`);
        }
        
        console.log("Bucket created successfully");
      }
      
      // Upload the image
      console.log("Uploading image to Supabase storage...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filename, imageBlob, {
          contentType: "image/png",
          cacheControl: "3600"
        });
      
      if (uploadError) {
        console.error("Failed to upload image:", uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      console.log("Image uploaded successfully:", uploadData?.path);
      
      // Get the public URL
      const { data: publicUrlData } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);
      
      const persistentUrl = publicUrlData.publicUrl;
      
      console.log("Image saved successfully:", persistentUrl);
      
      // If a user ID was provided, save the image reference in the database
      if (userId) {
        console.log("Saving image reference to database for user:", userId);
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
        } else {
          console.log("Image reference saved to database");
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
      JSON.stringify({ 
        success: false, 
        error: error.message || "An unknown error occurred" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
