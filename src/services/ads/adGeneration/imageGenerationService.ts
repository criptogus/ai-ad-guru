
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
  industry?: string;
  brandTone?: string;
  campaignObjective?: string;
  targetAudience?: string;
}

/**
 * Generate an image for an ad using AI
 */
export const generateAdImage = async (params: ImageGenerationParams): Promise<string | null> => {
  try {
    console.log('Generating ad image with params:', params);
    
    // Generate enhanced prompt based on campaign context
    const enhancedPrompt = generateEnhancedPrompt(params);
    console.log('Enhanced prompt:', enhancedPrompt);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt: enhancedPrompt,
        platform: params.platform,
        format: params.format || 'square'
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

/**
 * Generate enhanced prompt based on campaign context
 */
const generateEnhancedPrompt = (params: ImageGenerationParams): string => {
  const {
    prompt,
    platform,
    format = 'square',
    industry,
    brandTone = 'professional',
    campaignObjective,
    targetAudience
  } = params;

  // Base photography and quality specifications
  const baseQuality = "Photorealistic, ultra-realistic commercial photograph";
  const lighting = getLightingByIndustry(industry);
  const composition = getCompositionByFormat(format);
  const mood = getMoodByObjective(campaignObjective, brandTone);
  const style = getStyleByPlatform(platform);

  // Combine elements into final prompt
  const enhancedPrompt = `
    ${baseQuality} of ${prompt}. 
    ${lighting}. 
    ${composition}. 
    Focus on capturing the essence that appeals to ${targetAudience || 'the target audience'}. 
    Mood is ${mood}. 
    ${style}.
  `.replace(/\s+/g, ' ').trim();

  return enhancedPrompt;
};

const getLightingByIndustry = (industry?: string): string => {
  const lightingMap: Record<string, string> = {
    technology: "Clean commercial lighting with subtle blue tints",
    fashion: "Soft natural window light with elegant shadows",
    food: "Warm golden hour lighting with appetizing highlights",
    health: "Bright, clean medical-grade lighting",
    default: "Professional studio lighting with balanced shadows"
  };

  return lightingMap[industry?.toLowerCase() || 'default'];
};

const getCompositionByFormat = (format: string): string => {
  const compositionMap: Record<string, string> = {
    square: "Centered composition with rule of thirds, balanced negative space for text overlay",
    story: "Vertical composition with strong visual hierarchy, space at top and bottom",
    horizontal: "Wide cinematic composition with golden ratio placement",
    default: "Professional advertising composition with clear focal point"
  };

  return compositionMap[format] || compositionMap.default;
};

const getMoodByObjective = (objective?: string, tone = 'professional'): string => {
  const moodMap: Record<string, string> = {
    branding: `sophisticated and ${tone}`,
    leads: "engaging and action-oriented",
    sales: "dynamic and persuasive",
    awareness: "inspiring and memorable",
    default: `professional and ${tone}`
  };

  return moodMap[objective?.toLowerCase() || 'default'];
};

const getStyleByPlatform = (platform: string): string => {
  const styleMap: Record<string, string> = {
    meta: "In the style of premium Instagram advertising, optimized for social engagement",
    linkedin: "In the style of professional B2B advertising photography",
    google: "In the style of high-impact display advertising",
    default: "In the style of high-end commercial photography"
  };

  return styleMap[platform] || styleMap.default;
};
