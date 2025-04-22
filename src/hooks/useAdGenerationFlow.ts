
import { useState } from 'react';
import { generateAds } from '@/services/ads/adGeneration/adGenerationService';
import { CampaignPromptData } from '@/services/ads/adGeneration/types/promptTypes';
import { GeneratedAdContent } from '@/services/ads/adGeneration/types';

export const useAdGenerationFlow = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCampaignAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
    try {
      // Validate required fields
      if (!data.companyName || !data.platforms || data.platforms.length === 0) {
        console.error('Missing required data:', { data });
        throw new Error('Missing required campaign information');
      }

      // Log the complete data being sent for ad generation
      console.log('Generating ads with data:', JSON.stringify(data, null, 2));
      setIsGenerating(true);

      // Create a cleaned and structured version of the prompt data
      // This is critical to ensure the correct format for the unified prompt builder
      const promptData: CampaignPromptData = {
        companyName: data.companyName,
        websiteUrl: data.websiteUrl || '',
        objective: data.objective || 'awareness',
        product: data.product || '',
        targetAudience: data.targetAudience || '',
        brandTone: data.brandTone || 'professional',
        // Ensure we have both formats of mind triggers (object and single string)
        mindTrigger: data.mindTrigger || '',
        mindTriggers: data.mindTriggers || {},
        language: data.language || 'english',
        industry: data.industry || '',
        platforms: data.platforms || ['google', 'meta'],
        companyDescription: data.companyDescription || '',
        differentials: Array.isArray(data.differentials) ? data.differentials : 
                       (typeof data.differentials === 'string' ? [data.differentials] : []),
        keywords: Array.isArray(data.keywords) ? data.keywords : 
                 (typeof data.keywords === 'string' ? [data.keywords] : []),
        callToAction: Array.isArray(data.callToAction) ? data.callToAction[0] : 
                     (typeof data.callToAction === 'string' ? data.callToAction : 'Learn More')
      };

      const result = await generateAds(promptData);

      console.log('Generated ad content:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error generating ads:', error);
      throw error; // Rethrow to handle in component
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCampaignAds,
    isGenerating
  };
};
