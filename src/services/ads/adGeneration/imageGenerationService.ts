
/**
 * Image Generation Service
 * Handles generation and storage of ad images
 */

import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';

export interface ImageGenerationParams {
  prompt: string;
  platform: 'meta' | 'linkedin' | 'google';
  format?: 'square' | 'story' | 'horizontal';
  industry?: string;
  brandTone?: string;
  campaignObjective?: string;
  targetAudience?: string;
  language?: string;
}

export const generateAdImage = async (params: ImageGenerationParams): Promise<string | null> => {
  try {
    console.log('Starting image generation with params:', params);
    
    if (!params.prompt) {
      console.error('Missing image prompt');
      return null;
    }
    
    // Enhance the prompt with campaign context
    const enhancedPrompt = params.prompt.includes('profissional')
      ? params.prompt
      : `Fotografia publicitária profissional: ${params.prompt}`;
    
    console.log('Enhanced prompt for image generation:', enhancedPrompt);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt: enhancedPrompt,
        platform: params.platform,
        format: params.format || 'square',
        language: params.language || 'portuguese',
        additional: {
          industry: params.industry,
          brandTone: params.brandTone,
          campaignObjective: params.campaignObjective,
          targetAudience: params.targetAudience
        }
      }
    });
    
    if (error || !data?.success || !data?.imageUrl) {
      console.error('Error generating image:', error || data?.error || 'No URL generated');
      return null;
    }
    
    console.log('Successfully generated image:', data.imageUrl.substring(0, 50) + '...');
    return data.imageUrl;
  } catch (error) {
    errorLogger.logError(error, 'generateAdImage');
    return null;
  }
};
