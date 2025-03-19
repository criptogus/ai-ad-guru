
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";

interface StorageConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
}

export async function storeImageInSupabase(imageBlob: Blob, config: StorageConfig): Promise<string> {
  const { supabaseUrl, supabaseServiceKey } = config;
  
  console.log(`Storing image in Supabase. Image size: ${imageBlob.size} bytes, Type: ${imageBlob.type}`);
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const fileName = `ad-${Date.now()}.png`;
  const bucketName = 'ai-images';
  
  try {
    // Check if bucket exists, create if not
    console.log("Checking if bucket exists:", bucketName);
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log("Creating bucket:", bucketName);
      const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (bucketError) {
        console.error("Error creating bucket:", bucketError);
        throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
      }
    }
    
    // Upload the image to Supabase storage
    console.log(`Uploading image '${fileName}' to Supabase storage bucket '${bucketName}'...`);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(`instagram-ads/${fileName}`, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image to storage: ${uploadError.message}`);
    }
    
    if (!uploadData || !uploadData.path) {
      console.error("Upload succeeded but no path returned");
      throw new Error("Upload succeeded but no path returned");
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`instagram-ads/${fileName}`);
    
    if (!publicUrlData || !publicUrlData.publicUrl) {
      console.error("Failed to get public URL for uploaded image");
      throw new Error("Could not get public URL for uploaded image");
    }
    
    const persistentImageUrl = publicUrlData.publicUrl;
    
    console.log("Image stored successfully in Supabase storage");
    console.log("Persistent image URL:", persistentImageUrl);
    
    // Validate the URL is accessible
    try {
      const checkResponse = await fetch(persistentImageUrl, { method: 'HEAD' });
      if (!checkResponse.ok) {
        console.warn(`URL validation check returned status: ${checkResponse.status}`);
      } else {
        console.log("URL validation check successful");
      }
    } catch (checkError) {
      console.warn("URL validation check failed:", checkError);
      // Continue despite check failure - it might be a CORS issue
    }
    
    return persistentImageUrl;
  } catch (error) {
    console.error("Error in storeImageInSupabase:", error);
    throw error;
  }
}

export function createErrorResponse(error: Error): Response {
  console.error("Error in generate-image function:", error.message);
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
