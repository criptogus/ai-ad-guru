
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationParams {
  companyName?: string;
  brandTone?: string;
  industry?: string;
  [key: string]: any;
}

/**
 * Generate an ad image using AI based on a prompt
 */
export const generateAdImage = async (
  prompt: string, 
  additionalInfo?: ImageGenerationParams
): Promise<string | null> => {
  try {
    console.log("Generating ad image with prompt:", prompt);
    console.log("Additional info:", additionalInfo);
    
    // Call the Supabase edge function to generate the image
    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: { 
        prompt,
        additionalInfo
      },
    });

    if (error) {
      console.error("Error generating image:", error);
      throw new Error(error.message || "Failed to generate image");
    }

    if (!data || !data.success) {
      console.error("Image generation failed:", data?.error || "Unknown error");
      throw new Error(data?.error || "Failed to generate image");
    }

    console.log("Image generated successfully");
    return data.imageUrl;
  } catch (error) {
    console.error("Error in generateAdImage:", error);
    throw error;
  }
};
