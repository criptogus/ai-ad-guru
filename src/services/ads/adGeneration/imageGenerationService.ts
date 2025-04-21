
/**
 * Image Generation Service
 * Handles generation and storage of ad images
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
    console.log('Generating ad image with params:', params);
    
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
    
    if (!data?.success || !data?.imageUrl) {
      console.error('Image generation failed:', data?.error || 'No image URL returned');
      return null;
    }
    
    return data.imageUrl;
  } catch (error) {
    errorLogger.logError(error, 'generateAdImage');
    return null;
  }
};

