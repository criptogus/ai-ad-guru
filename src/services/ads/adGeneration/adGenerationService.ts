
import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData, GeneratedAdContent } from './types';
import { buildAdGenerationPrompt } from './promptBuilder';

export const generateAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    console.log('Generating ads with data:', data);
    
    // Build a detailed prompt using the provided template structure
    const prompt = buildAdGenerationPrompt(data);
    
    // Call the Supabase function to generate ads
    const { data: response, error } = await supabase.functions.invoke('generate-ads', {
      body: {
        prompt,
        language: data.language || 'portuguese'
      }
    });
    
    if (error) {
      console.error('Error generating ads:', error);
      errorLogger.logError(error, 'generateAds');
      return null;
    }
    
    if (!response?.success || !response?.content) {
      console.error('Ad generation failed:', response?.error || 'No content generated');
      return null;
    }
    
    // Validate the generated content
    const content = response.content;
    const validationResult = validateGeneratedContent(content, data.language || 'portuguese');
    
    if (!validationResult.isValid) {
      console.error('Generated content validation failed:', validationResult.reason);
      return null;
    }
    
    console.log('Successfully generated ads:', content);
    return content;
  } catch (error) {
    errorLogger.logError(error, 'generateAds');
    return null;
  }
};

interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

const validateGeneratedContent = (content: any, language: string): ValidationResult => {
  // Validate that we have at least one ad for each platform
  if (!content.google_ads?.length && !content.instagram_ads?.length && 
      !content.linkedin_ads?.length && !content.microsoft_ads?.length) {
    return {
      isValid: false,
      reason: 'No ads were generated for any platform'
    };
  }

  // Check for example or placeholder text
  const contentJson = JSON.stringify(content).toLowerCase();
  if (contentJson.includes('example') || contentJson.includes('placeholder') || 
      contentJson.includes('sample') || contentJson.includes('your company')) {
    return {
      isValid: false,
      reason: 'Generated content contains example or placeholder text'
    };
  }

  // Check for language inconsistency (basic check)
  // If language is Portuguese, check for common English words that shouldn't be there
  if (language.toLowerCase() === 'portuguese') {
    const englishWords = ['your', 'company', 'business', 'product', 'service', 'professional', 'image for'];
    for (const word of englishWords) {
      if (contentJson.includes(` ${word} `)) {
        return {
          isValid: false,
          reason: `English word "${word}" found in Portuguese ad content`
        };
      }
    }
  }

  // If language is English, check for common Portuguese words
  if (language.toLowerCase() === 'english') {
    const portugueseWords = ['empresa', 'negócio', 'produto', 'serviço', 'profissional', 'imagem para'];
    for (const word of portugueseWords) {
      if (contentJson.includes(` ${word} `)) {
        return {
          isValid: false,
          reason: `Portuguese word "${word}" found in English ad content`
        };
      }
    }
  }

  return { isValid: true };
};
