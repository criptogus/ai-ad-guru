
import { supabase } from "@/integrations/supabase/client";

interface ImageGenerationParams {
  companyName?: string;
  brandTone?: string;
  industry?: string;
  format?: string;
  adContext?: any;
  companyDescription?: string;
  [key: string]: any;
}

export const generateAdImage = async (
  prompt: string, 
  additionalInfo?: ImageGenerationParams
): Promise<string | null> => {
  try {
    console.log("Generating ad image with prompt:", prompt);
    console.log("Additional info:", additionalInfo);
    
    const format = additionalInfo?.format || additionalInfo?.adContext?.format || 'square';
    const adType = additionalInfo?.adType || 'instagram';
    
    // Create a more controlled image prompt
    const enhancedPrompt = `Create a high-resolution, photorealistic ad image that strictly represents:

Brand: ${additionalInfo?.companyName || additionalInfo?.brandName || ''}
Industry: ${additionalInfo?.industry || additionalInfo?.adContext?.industry || ''}
Context: ${additionalInfo?.adContext?.objective || ''}
Target: ${additionalInfo?.adContext?.targetAudience || ''}
Description: ${additionalInfo?.companyDescription || ''}

Requirements:
- Professional, agency-quality photograph
- Modern and cinematic style
- No text overlays or artificial elements
- Natural lighting and composition
- Format: ${adType === 'instagram' ? 'Instagram 1080x1080px' : 'LinkedIn 1200x627px'}

Base prompt: ${prompt}`;

    // Enhanced request body
    const requestBody = { 
      prompt: enhancedPrompt,
      additionalInfo: {
        ...additionalInfo,
        format,
        adType,
        industry: additionalInfo?.industry || additionalInfo?.adContext?.industry || '',
        brandName: additionalInfo?.companyName || additionalInfo?.brandName || '',
        companyDescription: additionalInfo?.companyDescription || '',
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
