
import { MetaAd } from "@/hooks/adGeneration/types";
import { buildImagePrompt } from "./imagePromptBuilder";
import { supabase } from "@/integrations/supabase/client";
import { formatMapping, GenerationFormat } from "@/types/adFormats";

export const generateAdImage = async (
  imagePrompt: string,
  additionalInfo: { 
    platform: string; 
    format?: string;
    companyName?: string;
    brandTone?: string;
    industry?: string;
  }
): Promise<string | null> => {
  try {
    console.log('Generating image with prompt:', imagePrompt);
    console.log('Additional info:', additionalInfo);
    
    // Map platform to known type
    const platform = additionalInfo.platform === 'meta' ? 'instagram' : additionalInfo.platform;
    
    // Format to generation format
    let format: GenerationFormat = 'square';
    if (additionalInfo.format && additionalInfo.format in formatMapping) {
      format = formatMapping[additionalInfo.format as keyof typeof formatMapping];
    }
    
    // Build a detailed prompt that will generate a high-quality image
    const enhancedPrompt = buildImagePrompt({
      basePrompt: imagePrompt,
      platform,
      format,
      companyName: additionalInfo.companyName || '',
      brandTone: additionalInfo.brandTone || 'professional',
      industry: additionalInfo.industry || '',
    });
    
    console.log('Enhanced image prompt:', enhancedPrompt);
    
    // Call the Supabase function to generate the image
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: {
        prompt: enhancedPrompt,
        size: getImageSize(format),
        style: 'vivid', // or 'natural' for less vibrant results
        quality: 'hd', // or 'standard' for faster, lower quality
      }
    });
    
    if (error) {
      console.error('Error generating image:', error);
      return null;
    }
    
    if (!data?.imageUrl) {
      console.error('No image URL returned:', data);
      return null;
    }
    
    console.log('Successfully generated image, URL truncated for privacy:', 
      data.imageUrl.substring(0, 20) + '...' + data.imageUrl.substring(data.imageUrl.length - 20));
    
    return data.imageUrl;
  } catch (error) {
    console.error('Error in generateAdImage:', error);
    return null;
  }
};

// Determine appropriate image size based on format
function getImageSize(format: GenerationFormat): string {
  switch (format) {
    case 'square':
      return '1024x1024';
    case 'horizontal':
    case 'landscape':
      return '1792x1024';
    case 'story':
    case 'portrait':
      return '1024x1792';
    default:
      return '1024x1024';
  }
}

// Process ad with image generation
export const processMetaAdWithImage = async (
  ad: MetaAd, 
  additionalInfo: any
): Promise<MetaAd> => {
  try {
    if (!ad.imagePrompt || ad.imageUrl) {
      return ad; // Skip if no prompt or already has an image
    }
    
    const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
    
    if (imageUrl) {
      return {
        ...ad,
        imageUrl
      };
    }
    
    return ad;
  } catch (error) {
    console.error('Error processing ad with image:', error);
    return ad;
  }
};
