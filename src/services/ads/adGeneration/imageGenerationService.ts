
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
    
    // Call the Supabase edge function to generate the image
    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: { 
        imagePrompt: prompt,
        platform: params.platform || 'meta',
        format: params.format || 'square',
        adContext: {
          brandName: params.companyName,
          industry: params.industry,
          brandTone: params.brandTone
        }
      },
    });

    if (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image', { 
        description: error.message || 'Unknown error'
      });
      return null;
    }

    if (!data || !data.success || !data.imageUrl) {
      console.error('Image generation failed:', data?.error || 'Unknown error');
      toast.error('Image generation failed', { 
        description: data?.error || 'Failed to generate image'
      });
      return null;
    }

    console.log('Image generated successfully:', data.imageUrl.substring(0, 50) + '...');
    return data.imageUrl;
  } catch (error) {
    console.error('Error in generateAdImage:', error);
    toast.error('Error generating image', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    return null;
  }
};

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
