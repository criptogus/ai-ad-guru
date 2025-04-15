
import { errorLogger } from '@/services/libs/error-handling';

export interface MetaAdImageParams {
  basePrompt: string;
  format?: 'square' | 'portrait' | 'story' | 'reel' | 'landscape';
  style?: string;
  industry?: string;
  brandName?: string;
  brandColors?: string;
  targetAudience?: string;
  userId: string;
}

export interface GeneratedMetaAdImage {
  url: string;
  prompt: string;
  originalPrompt: string;
  format: string;
  timestamp: string;
}

// Ad format dimensions
export const adFormats = {
  'square': { width: 1080, height: 1080, description: 'Instagram/Facebook Square (1:1)' },
  'portrait': { width: 1080, height: 1350, description: 'Instagram Portrait (4:5)' },
  'landscape': { width: 1200, height: 628, description: 'Facebook Feed (1.91:1)' },
  'story': { width: 1080, height: 1920, description: 'Instagram/Facebook Story (9:16)' },
  'carousel': { width: 1080, height: 1080, description: 'Instagram/Facebook Carousel (1:1)' }
};

// Ad style presets
export const adStyles = {
  'professional': 'professional, clean corporate style with subtle branding',
  'minimal': 'minimalist design with ample white space and simple elements',
  'vibrant': 'vibrant and colorful imagery with bold contrasts',
  'lifestyle': 'authentic lifestyle photography showing real people using products',
  'product-focus': 'clear product showcase with detailed features highlighted',
  'luxury': 'elegant, high-end aesthetic with premium feel',
  'playful': 'playful and energetic design with fun elements',
  'tech': 'modern tech aesthetic with futuristic elements'
};

// Industry-specific enhancement presets
export const industryPresets = {
  'ecommerce': 'product-centric with clear value proposition',
  'saas': 'digital interface elements with abstract tech concepts',
  'finance': 'professional and trustworthy with data visualization elements',
  'health': 'clean, medical aesthetic with wellness imagery',
  'education': 'knowledge-focused imagery with learning elements',
  'food': 'appetizing high-quality food photography with vibrant colors',
  'travel': 'inspiring destination imagery with aspirational elements',
  'real-estate': 'architectural photography with spacious perspectives'
};

/**
 * Enhances a user prompt to create optimal advertising imagery
 */
export function enhancePrompt(
  basePrompt: string, 
  options: {
    format?: string;
    style?: string;
    industry?: string;
    brandName?: string;
    brandColors?: string;
    targetAudience?: string;
  } = {}
): string {
  const format = options.format || 'square';
  const style = options.style || 'professional';
  const industry = options.industry || '';
  const brandName = options.brandName || '';
  const brandColors = options.brandColors || '';
  const target = options.targetAudience || '';
  
  // Start with the base prompt
  let enhancedPrompt = basePrompt;
  
  // Add style enhancement
  enhancedPrompt += `. Image should be in ${adStyles[style as keyof typeof adStyles] || style} style.`;
  
  // Add format-specific guidance
  if (format === 'square') {
    enhancedPrompt += ' Composition should be balanced and centered for a square format.';
  } else if (format === 'portrait') {
    enhancedPrompt += ' Composition should be vertically oriented with main elements centered.';
  } else if (format === 'landscape') {
    enhancedPrompt += ' Composition should be horizontally oriented with balanced elements.';
  } else if (format === 'story') {
    enhancedPrompt += ' Composition should be designed for vertical full-screen viewing with main elements centered and space at top and bottom for text.';
  }
  
  // Add industry-specific elements if provided
  if (industry && industryPresets[industry as keyof typeof industryPresets]) {
    enhancedPrompt += ` Image should be ${industryPresets[industry as keyof typeof industryPresets]}.`;
  }
  
  // Add brand elements if provided
  if (brandName) {
    enhancedPrompt += ` Should subtly incorporate elements that represent the brand "${brandName}".`;
  }
  
  if (brandColors) {
    enhancedPrompt += ` Use brand color palette: ${brandColors}.`;
  }
  
  // Add target audience consideration if provided
  if (target) {
    enhancedPrompt += ` Image should appeal to ${target} audience.`;
  }
  
  // Add advertising-specific requirements
  enhancedPrompt += ' Image should have professional advertising quality, with clean composition, strategic negative space for text overlay, and visually compelling focal points. Should look like high-end professional advertising created by a top marketing agency.';
  
  // Add Meta Ads compliance reminder
  enhancedPrompt += ' Image must comply with Meta Ads policies: no excessive text, no offensive content, no unrealistic claims visualized.';
  
  return enhancedPrompt;
}

/**
 * Generates an image for Meta Ads using OpenAI's DALL-E API via Supabase Edge Function
 */
export const generateMetaAdImage = async (params: MetaAdImageParams): Promise<GeneratedMetaAdImage | null> => {
  try {
    const { basePrompt, format = 'square', style = 'professional', industry, brandName, brandColors, targetAudience, userId } = params;
    
    // Enhance the prompt
    const enhancedPrompt = enhancePrompt(basePrompt, {
      format,
      style,
      industry,
      brandName,
      brandColors,
      targetAudience
    });
    
    console.log('Generating Meta ad image with enhanced prompt:', enhancedPrompt.substring(0, 100) + '...');
    
    // Call the generate-image-gpt4o edge function
    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: { 
        imagePrompt: enhancedPrompt,
        platform: 'meta',
        format: format,
        adContext: {
          industry,
          brandName,
          brandColors,
          targetAudience,
          style,
          userId
        }
      }
    });
    
    if (error) {
      console.error('Error calling generate-image-gpt4o edge function:', error);
      throw error;
    }
    
    if (!data || !data.success || !data.imageUrl) {
      console.error('No image URL returned from function:', data);
      throw new Error('Failed to generate image');
    }
    
    const result: GeneratedMetaAdImage = {
      url: data.imageUrl,
      prompt: enhancedPrompt,
      originalPrompt: basePrompt,
      format: format,
      timestamp: new Date().toISOString()
    };
    
    console.log('Successfully generated Meta ad image');
    return result;
    
  } catch (error) {
    errorLogger.logError(error, 'generateMetaAdImage');
    return null;
  }
};

/**
 * Get format options for UI
 */
export const getFormatOptions = () => {
  return Object.keys(adFormats).map(key => ({
    id: key,
    name: adFormats[key as keyof typeof adFormats].description,
    width: adFormats[key as keyof typeof adFormats].width,
    height: adFormats[key as keyof typeof adFormats].height
  }));
};

/**
 * Get style options for UI
 */
export const getStyleOptions = () => {
  return Object.keys(adStyles).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')
  }));
};

/**
 * Get industry options for UI
 */
export const getIndustryOptions = () => {
  return Object.keys(industryPresets).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')
  }));
};

/**
 * Estimates token usage and cost for an image generation request
 */
export const estimateGenerationCost = (prompt: string) => {
  // Very rough estimation
  // DALL-E 3 HD costs approximately $0.080 per image
  return {
    cost: 0.08,
    currency: 'USD',
    tokens: Math.ceil(prompt.length / 4),
    credits: 5
  };
};
