
/**
 * Image Generation Service
 * Generates ad images for various platforms
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';

export interface ImageGenerationParams {
  prompt: string;
  platform: 'meta' | 'linkedin' | 'google';
  width?: number;
  height?: number;
  style?: string;
  format?: 'square' | 'story' | 'horizontal';
  brandTone?: string;
}

/**
 * Generate an image for an ad using AI
 */
export const generateAdImage = async (params: ImageGenerationParams): Promise<string | null> => {
  try {
    console.log('Generating ad image with params', params);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt: params.prompt,
        platform: params.platform,
        format: params.format || 'square',
        brandTone: params.style || params.brandTone || 'professional'
      }
    });
    
    if (error) {
      console.error('Error generating image:', error);
      errorLogger.logError(error, 'generateAdImage');
      return null;
    }
    
    return data?.imageUrl || null;
  } catch (error) {
    errorLogger.logError(error, 'generateAdImage');
    return null;
  }
};

/**
 * Generate a banner image using DALL-E 3
 */
export const generateBannerImage = async (
  prompt: string, 
  platform: string = 'instagram',
  format: string = 'square',
  templateType: string = 'product',
  templateName: string = '',
  templateId: string = '',
  brandTone: string = 'professional'
): Promise<{imageUrl: string, revisedPrompt?: string} | null> => {
  try {
    console.log('Generating banner image with prompt:', prompt.substring(0, 100) + '...');
    
    const { data, error } = await supabase.functions.invoke('generate-banner-image', {
      body: { 
        prompt,
        platform,
        format,
        templateType,
        templateName,
        templateId,
        brandTone
      }
    });
    
    if (error) {
      console.error('Error generating banner image:', error);
      errorLogger.logError(error, 'generateBannerImage');
      return null;
    }
    
    if (!data?.success || !data?.imageUrl) {
      console.error('Banner image generation failed:', data?.error || 'No image URL returned');
      return null;
    }
    
    return {
      imageUrl: data.imageUrl,
      revisedPrompt: data.revisedPrompt
    };
  } catch (error) {
    errorLogger.logError(error, 'generateBannerImage');
    return null;
  }
};

/**
 * Generate an image using GPT-4o
 */
export const generateImageWithGPT4o = async (prompt: string, platform: string, format?: string): Promise<string | null> => {
  try {
    const enhancedPrompt = enhanceImagePrompt(prompt, platform);
    console.log('Generating image with GPT-4o:', enhancedPrompt.substring(0, 100) + '...');
    
    // TODO: Update this to call the GPT-4o edge function when available
    return generateAdImage({
      prompt: enhancedPrompt,
      platform: platform as 'meta' | 'linkedin' | 'google',
      format: format as 'square' | 'story' | 'horizontal' | undefined
    });
  } catch (error) {
    errorLogger.logError(error, 'generateImageWithGPT4o');
    return null;
  }
};

/**
 * Enhance an image prompt with platform-specific details
 */
export const enhanceImagePrompt = (prompt: string, platform: string, style?: string): string => {
  let enhancedPrompt = prompt;
  
  // Add platform-specific context
  if (platform === 'meta') {
    enhancedPrompt += ' Create a vibrant, attention-grabbing image suitable for Instagram.';
  } else if (platform === 'linkedin') {
    enhancedPrompt += ' Create a professional, business-oriented image suitable for LinkedIn.';
  }
  
  // Add style information if provided
  if (style) {
    enhancedPrompt += ` Style: ${style}.`;
  }
  
  // Add general quality improvements
  enhancedPrompt += ' High quality, photorealistic, detailed.';
  
  return enhancedPrompt;
};
