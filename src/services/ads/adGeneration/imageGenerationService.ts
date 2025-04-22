
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationParams {
  companyName?: string;
  brandTone?: string;
  industry?: string;
  format?: string;
  adContext?: any;
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
    
    // Extract format from additionalInfo for proper image generation
    const format = additionalInfo?.format || additionalInfo?.adContext?.format || 'square';
    const adType = additionalInfo?.adType || 'instagram';
    
    // Create an enhanced image prompt with more context
    const enhancedPrompt = `Create a high-resolution, photorealistic ad image based on:
- Brand: ${additionalInfo?.companyName || additionalInfo?.brandName || ''}
- Industry: ${additionalInfo?.industry || additionalInfo?.adContext?.industry || ''}
- Objective: ${additionalInfo?.adContext?.objective || ''}
- Target audience: ${additionalInfo?.adContext?.targetAudience || ''}
- Style: Cinematic, modern, agency-quality
- Colors: Include hints of #3B82F6 and #10B981
- Do not include text in the image
- Format: ${adType === 'instagram' ? 'Instagram 1080x1080px' : 'LinkedIn 1200x627px'}

Original prompt: ${prompt}`;
    
    // Enhanced request body with more context
    const requestBody = { 
      prompt: enhancedPrompt,
      additionalInfo: {
        ...additionalInfo,
        format,
        adType,
        industry: additionalInfo?.industry || additionalInfo?.adContext?.industry || '',
        brandName: additionalInfo?.companyName || additionalInfo?.brandName || '',
      }
    };
    
    console.log("Sending image generation request with body:", requestBody);
    
    // Call the Supabase edge function to generate the image
    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: requestBody,
    });

    if (error) {
      console.error("Error generating image:", error);
      throw new Error(error.message || "Failed to generate image");
    }

    if (!data || !data.success) {
      console.error("Image generation failed:", data?.error || "Unknown error");
      throw new Error(data?.error || "Failed to generate image");
    }

    console.log("Image generated successfully:", data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error("Error in generateAdImage:", error);
    throw error;
  }
};
