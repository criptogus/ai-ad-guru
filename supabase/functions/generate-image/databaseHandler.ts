
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./utils.ts";

interface SaveImageParams {
  imageUrl: string;
  prompt: string;
  userId: string;
  templateId?: string;
  campaignId?: string;
  supabaseUrl: string;
  supabaseKey: string;
}

export async function saveGeneratedImage(params: SaveImageParams): Promise<string> {
  const { 
    imageUrl, 
    prompt, 
    userId, 
    templateId, 
    campaignId,
    supabaseUrl,
    supabaseKey
  } = params;
  
  if (!userId) {
    console.warn("No user ID provided, skipping database save");
    return imageUrl;
  }
  
  console.log(`Saving generated image to database for user: ${userId}`);
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Save the record to the generated_images table
    const { data, error } = await supabase
      .from('generated_images')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        prompt_used: prompt,
        template_id: templateId || null,
        campaign_id: campaignId || null
      })
      .select('id')
      .single();
      
    if (error) {
      console.error("Error saving to database:", error);
      // Continue even if database save fails - the user still gets their image
      return imageUrl;
    }
    
    console.log("Image saved to database successfully, ID:", data.id);
    return imageUrl;
    
  } catch (error) {
    console.error("Error in saveGeneratedImage:", error);
    // Return the original URL even if save fails
    return imageUrl;
  }
}
