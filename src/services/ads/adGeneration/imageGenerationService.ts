
import { GenerationFormat } from '@/types/adFormats';
import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';

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
    
    // Ensure language consistency
    const language = params.language || 'portuguese';
    
    // Enhance the prompt with campaign context
    let enhancedPrompt = params.prompt;
    
    // If the prompt appears generic or too short, add more context
    if (enhancedPrompt.toLowerCase().includes('professional') || 
        enhancedPrompt.toLowerCase().includes('image for') ||
        enhancedPrompt.length < 50) {
      
      // Add context from available campaign data
      const contextElements = [];
      
      if (params.industry) contextElements.push(`Indústria: ${params.industry}`);
      if (params.targetAudience) contextElements.push(`Público: ${params.targetAudience}`);
      if (params.campaignObjective) contextElements.push(`Objetivo: ${params.campaignObjective}`);
      if (params.brandTone) contextElements.push(`Tom: ${params.brandTone}`);
      
      const additionalContext = contextElements.join('. ');
      enhancedPrompt = `${enhancedPrompt}. ${additionalContext}`;
    }
    
    // Add language-appropriate prefix to ensure proper language generation
    if (language.toLowerCase().includes('portuguese') || language.toLowerCase().includes('português')) {
      enhancedPrompt = `Criação de imagem publicitária profissional em português: ${enhancedPrompt}. 
Não inclua texto na imagem. Estilo fotográfico de alta qualidade, como uma produção profissional.`;
    } else if (language.toLowerCase().includes('english')) {
      enhancedPrompt = `Professional advertising image creation in English: ${enhancedPrompt}. 
Do not include text in the image. High-quality photographic style, like a professional production.`;
    }
    
    console.log('Enhanced prompt for image generation:', enhancedPrompt);
    
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { 
        prompt: enhancedPrompt,
        platform: params.platform,
        format: params.format,
        language: language,
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
