
import { supabase } from "@/integrations/supabase/client";
import { buildImagePrompt } from "./imagePromptBuilder";
import { AdFormat, formatDimensions } from "@/types/adFormats";

export interface ImageGenerationParams {
  platform: 'instagram' | 'facebook' | 'linkedin' | 'google' | 'meta';
  format: AdFormat;
  prompt: string;
  companyName: string;
  brandTone?: string;
  industry?: string;
}

/**
 * Generates an image for ads based on prompt and additional context
 * @param prompt The base image description
 * @param additionalInfo Additional context like platform, format, etc.
 * @returns URL of the generated image
 */
export const generateAdImage = async (
  prompt: string, 
  additionalInfo?: Partial<ImageGenerationParams>
): Promise<string | null> => {
  try {
    if (!prompt) {
      throw new Error("Image prompt is required");
    }
    
    // Extract parameters or use defaults
    const platform = additionalInfo?.platform || 'instagram';
    const format = additionalInfo?.format || 'square';
    const companyName = additionalInfo?.companyName || 'Your Company';
    const brandTone = additionalInfo?.brandTone || 'professional';
    
    // Build the enhanced prompt
    const enhancedPrompt = buildImagePrompt({
      brandName: companyName,
      productService: additionalInfo?.industry || "services",
      campaignObjective: "brand awareness",
      targetAudience: "business professionals",
      tone: brandTone,
      platform: platform,
      format: format,
      mentalTrigger: "trust"
    });
    
    console.log("Generating image with prompt:", enhancedPrompt.substring(0, 100) + "...");
    
    // Call the OpenAI image generation function
    const { data, error } = await supabase.functions.invoke("generate-image", {
      body: {
        prompt: enhancedPrompt,
        size: `${formatDimensions[format].width}x${formatDimensions[format].height}`
      }
    });
    
    if (error) {
      console.error("Error calling generate-image function:", error);
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    
    if (!data || !data.imageUrl) {
      console.error("No image URL returned:", data);
      throw new Error("Failed to generate image: No URL returned");
    }
    
    console.log("Generated image URL:", data.imageUrl);
    
    return data.imageUrl;
  } catch (error) {
    console.error("Error in generateAdImage:", error);
    throw error;
  }
};
