
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";

interface StorageConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
}

export async function storeImageInSupabase(imageBlob: Blob, config: StorageConfig): Promise<string> {
  const { supabaseUrl, supabaseServiceKey } = config;
  
  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const fileName = `ad-${Date.now()}.png`;
  const bucketName = 'ai-images';
  
  // Check if bucket exists, create if not
  console.log("Checking if bucket exists...");
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  
  if (!bucketExists) {
    console.log("Creating bucket:", bucketName);
    const { error: bucketError } = await supabase.storage.createBucket(bucketName, {
      public: true
    });
    
    if (bucketError) {
      console.error("Error creating bucket:", bucketError);
      throw new Error(`Failed to create storage bucket: ${bucketError.message}`);
    }
  }
  
  // Upload the image to Supabase storage
  console.log("Uploading image to Supabase storage...");
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(`instagram-ads/${fileName}`, imageBlob, {
      contentType: 'image/png',
      cacheControl: '3600'
    });
  
  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error(`Failed to upload image to storage: ${uploadError.message}`);
  }
  
  // Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(`instagram-ads/${fileName}`);
  
  const persistentImageUrl = publicUrlData.publicUrl;
  
  console.log("Image stored in Supabase storage");
  console.log("Persistent image URL:", persistentImageUrl);
  
  return persistentImageUrl;
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
