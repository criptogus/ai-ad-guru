
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
    const isValid = validateGeneratedContent(content);
    
    if (!isValid) {
      console.error('Generated content validation failed');
      return null;
    }
    
    console.log('Successfully generated ads:', content);
    return content;
  } catch (error) {
    errorLogger.logError(error, 'generateAds');
    return null;
  }
};

const validateGeneratedContent = (content: any): boolean => {
  // Validate that we have at least one ad for each platform
  if (!content.google_ads?.length && !content.instagram_ads?.length && 
      !content.linkedin_ads?.length && !content.microsoft_ads?.length) {
    return false;
  }

  // Check for example or placeholder text
  const hasExampleText = JSON.stringify(content)
    .toLowerCase()
    .includes('example');

  if (hasExampleText) {
    console.error('Generated content contains example text');
    return false;
  }

  return true;
};
