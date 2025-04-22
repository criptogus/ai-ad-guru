
import { supabase } from '@/integrations/supabase/client';
import { ImageGenerationParams } from './types';
import { toast } from 'sonner';

/**
 * Generates an image for an ad using AI
 * 
 * @param prompt The text prompt describing the image to generate
 * @param params Additional parameters for image generation
 * @returns The URL of the generated image or null if generation fails
 */
export const generateAdImage = async (
  prompt: string,
  params: Partial<ImageGenerationParams> = {}
): Promise<string | null> => {
  try {
    console.log('Generating ad image with prompt:', prompt);
    
    // Enhanced image quality instructions
    const enhancedPrompt = enhanceImagePrompt(prompt, params);
    
    // Call the Supabase edge function to generate the image
    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: { 
        imagePrompt: enhancedPrompt,
        platform: params.platform || 'meta',
        format: params.format || 'square',
        adContext: {
          brandName: params.companyName,
          industry: params.industry,
          brandTone: params.brandTone,
          targetAudience: params.targetAudience,
          language: params.language || 'portuguese'
        }
      },
    });

    if (error) {
      console.error('Error generating image:', error);
      toast.error('Falha ao gerar imagem', { 
        description: error.message || 'Erro desconhecido'
      });
      return null;
    }

    if (!data || !data.success || !data.imageUrl) {
      console.error('Image generation failed:', data?.error || 'Unknown error');
      toast.error('Falha na geração da imagem', { 
        description: data?.error || 'Não foi possível gerar a imagem'
      });
      return null;
    }

    console.log('Image generated successfully:', data.imageUrl.substring(0, 50) + '...');
    return data.imageUrl;
  } catch (error) {
    console.error('Error in generateAdImage:', error);
    toast.error('Erro ao gerar imagem', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};

/**
 * Enhances image prompt with additional quality instructions
 */
function enhanceImagePrompt(
  basePrompt: string,
  params: Partial<ImageGenerationParams> = {}
): string {
  // Platform-specific enhancements
  let platformSpecific = '';
  if (params.platform === 'meta' || params.platform === 'instagram') {
    platformSpecific = 'Create a professional, high-quality advertisement image suitable for Instagram and Facebook. Image should have good composition with space for text overlay.';
  } else if (params.platform === 'linkedin') {
    platformSpecific = 'Create a professional, business-oriented image suitable for LinkedIn advertising. Image should convey professionalism and expertise.';
  }
  
  // Format-specific enhancements
  let formatSpecific = '';
  if (params.format === 'square') {
    formatSpecific = 'Create a square format (1:1 aspect ratio) image.';
  } else if (params.format === 'portrait') {
    formatSpecific = 'Create a portrait format (4:5 aspect ratio) image.';
  } else if (params.format === 'landscape') {
    formatSpecific = 'Create a landscape format (1.91:1 aspect ratio) image.';
  } else if (params.format === 'story') {
    formatSpecific = 'Create a story format (9:16 aspect ratio) image.';
  }
  
  // General quality enhancements
  const qualityEnhancements = [
    'Create a professional, premium quality marketing image.',
    'Image should have beautiful lighting, high resolution details, and perfect composition.',
    'Should look like a professional stock photo or premium advertising photo.',
    'No text or watermarks in the image.',
    'Photorealistic, not illustrated or cartoon style.'
  ].join(' ');
  
  // Combine everything
  return `${basePrompt.trim()}
${platformSpecific}
${formatSpecific}
${qualityEnhancements}
Brand: ${params.companyName || ''}
Industry: ${params.industry || ''}
Target audience: ${params.targetAudience || ''}
Style: ${params.brandTone || 'professional and modern'}`;
}

/**
 * Builds an image prompt with enhanced context
 * This keeps compatibility with existing code
 */
export const buildImagePrompt = (
  basePrompt: string,
  additionalContext: Record<string, any> = {}
): string => {
  // Simply return the base prompt with any additional context
  // The actual enhancement will happen in the edge function
  return basePrompt;
};
