
import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData, GeneratedAdContent } from './types';
import { buildAdGenerationPrompt } from './promptBuilder';

export const generateAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    console.log('Generating ads with data:', JSON.stringify(data, null, 2));
    
    // Build a detailed prompt using the provided template structure
    const { systemMessage, userMessage } = buildAdGenerationPrompt(data);
    
    // Call the Supabase function to generate ads with the new prompt structure
    const { data: response, error } = await supabase.functions.invoke('generate-ads', {
      body: {
        systemMessage,
        userMessage,
        language: data.language || 'portuguese',
        temperature: 0.7  // Slightly lower temperature for more consistent results
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
    const validationResult = validateGeneratedContent(content, data);
    
    if (!validationResult.isValid) {
      console.error('Generated content validation failed:', validationResult.reason);
      return null;
    }
    
    console.log('Successfully generated ads, sample:', JSON.stringify(content).substring(0, 300) + '...');
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

const validateGeneratedContent = (content: any, campaignData: CampaignPromptData): ValidationResult => {
  const language = campaignData.language || 'portuguese';
  const companyName = campaignData.companyName || '';
  
  // Validate that we have at least one ad for each requested platform
  const requestedPlatforms = campaignData.platforms || ['google'];
  let missingPlatforms = [];
  
  if (requestedPlatforms.includes('google') && (!content.google_ads || content.google_ads.length === 0)) {
    missingPlatforms.push('google');
  }
  if (requestedPlatforms.includes('meta') && (!content.instagram_ads || content.instagram_ads.length === 0)) {
    missingPlatforms.push('instagram');
  }
  if (requestedPlatforms.includes('linkedin') && (!content.linkedin_ads || content.linkedin_ads.length === 0)) {
    missingPlatforms.push('linkedin');
  }
  if (requestedPlatforms.includes('microsoft') && (!content.microsoft_ads || content.microsoft_ads.length === 0)) {
    missingPlatforms.push('microsoft');
  }
  
  if (missingPlatforms.length > 0) {
    return {
      isValid: false,
      reason: `Missing ads for requested platforms: ${missingPlatforms.join(', ')}`
    };
  }

  // Check for common placeholders and generic text
  const contentJson = JSON.stringify(content).toLowerCase();
  const genericTerms = [
    'example', 'exemplo', 'placeholder', 'sample', 'amostra', 
    'your company', 'sua empresa', 'your business', 'seu negócio',
    'company name', 'nome da empresa', 'click here', 'clique aqui'
  ];
  
  for (const term of genericTerms) {
    if (contentJson.includes(term.toLowerCase())) {
      return {
        isValid: false,
        reason: `Generated content contains generic placeholder: "${term}"`
      };
    }
  }
  
  // Check that company name is actually used in the content
  if (!contentJson.toLowerCase().includes(companyName.toLowerCase()) && companyName.length > 0) {
    return {
      isValid: false,
      reason: `Generated content does not mention company name "${companyName}"`
    };
  }

  // Check for language consistency based on specified language
  // For Portuguese content: Check for common English words that shouldn't be there
  if (language.toLowerCase().includes('portuguese') || language.toLowerCase().includes('português')) {
    const englishWords = ['your', 'business', 'product', 'service', 'professional', 'image for', 'get', 'now', 'free', 'today'];
    for (const word of englishWords) {
      // Use word boundary to avoid partial matches
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(contentJson)) {
        return {
          isValid: false,
          reason: `English word "${word}" found in Portuguese ad content`
        };
      }
    }
  }

  // For English content: Check for common Portuguese words
  if (language.toLowerCase().includes('english') || language.toLowerCase() === 'inglês') {
    const portugueseWords = ['empresa', 'negócio', 'produto', 'serviço', 'profissional', 'imagem para', 'agora', 'grátis', 'hoje'];
    for (const word of portugueseWords) {
      // Use word boundary to avoid partial matches
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(contentJson)) {
        return {
          isValid: false,
          reason: `Portuguese word "${word}" found in English ad content`
        };
      }
    }
  }

  // Check image prompts for quality
  const imagePrompts = [
    ...(content.instagram_ads || []).map((ad: any) => ad.imagePrompt || ''),
    ...(content.linkedin_ads || []).map((ad: any) => ad.imagePrompt || '')
  ].filter(prompt => prompt.length > 0);
  
  for (const prompt of imagePrompts) {
    if (prompt.length < 30) {
      return {
        isValid: false,
        reason: `Image prompt too short: "${prompt}"`
      };
    }
    
    if (!prompt.toLowerCase().includes(companyName.toLowerCase()) && companyName.length > 0) {
      return {
        isValid: false,
        reason: `Image prompt does not reference the company context: "${prompt}"`
      };
    }
  }

  return { isValid: true };
};

