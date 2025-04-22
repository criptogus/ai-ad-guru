
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

      const result = await generateAds({
        companyName: data.companyName,
        websiteUrl: data.websiteUrl || 'example.com',
        objective: data.objective || 'awareness',
        product: data.product || '',
        targetAudience: data.targetAudience || '',
        brandTone: data.brandTone || 'professional',
        mindTrigger: data.mindTrigger || '',
        language: data.language || 'english',
        industry: data.industry || '',
        platforms: data.platforms || ['google', 'meta'],
        companyDescription: data.companyDescription || '',
        differentials: data.differentials || []
      });

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
