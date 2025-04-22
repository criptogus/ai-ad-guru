
import { GenerationFormat } from '@/types/adFormats';
import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { buildImageGenerationPrompt } from './imagePromptBuilder';

export interface ImageGenerationParams {
  prompt: string;
  platform: 'meta' | 'linkedin' | 'google';
  format: GenerationFormat;
  industry?: string;
  brandTone?: string;
  campaignObjective?: string;
  targetAudience?: string;
  language?: string;
}

export const generateAdImage = async (params: ImageGenerationParams): Promise<string | null> => {
  try {
    console.log('Starting image generation with params:', JSON.stringify(params, null, 2));
    
    if (!params.prompt) {
      console.error('Missing image prompt');
      return null;
    }
    
    // Build enhanced prompt using the new builder
    const enhancedPrompt = buildImageGenerationPrompt({
      brandName: params.industry || 'Brand',
      productService: params.campaignObjective || params.prompt,
      campaignObjective: params.campaignObjective || 'Engage audience',
      targetAudience: params.targetAudience || 'Professional audience',
      tone: params.brandTone || 'professional',
      mentalTrigger: params.prompt,
      platform: params.platform,
      format: params.format,
      brandColors: ['#3B82F6', '#10B981']
    });
    
    console.log('Enhanced prompt for image generation:', enhancedPrompt);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt: enhancedPrompt,
        platform: params.platform,
        format: params.format,
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
    
    console.log('Successfully generated image URL:', data.imageUrl.substring(0, 50) + '...');
    return data.imageUrl;
  } catch (error) {
    errorLogger.logError(error, 'generateAdImage');
    return null;
  }
};
