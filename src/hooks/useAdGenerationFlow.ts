
import { useState } from 'react';
import { generateAds } from '@/services/ads/adGeneration/adGenerationService';
import { CampaignPromptData } from '@/services/ads/adGeneration/types/promptTypes';
import { useToast } from '@/hooks/use-toast';

export const useAdGenerationFlow = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCampaignAds = async (data: CampaignPromptData) => {
    try {
      // Validate required fields
      if (!data.companyName || !data.websiteUrl || !data.objective || !data.targetAudience) {
        console.error('Missing required data:', { data });
        throw new Error('Missing required campaign information');
      }

      console.log('Generating ads with data:', data);
      setIsGenerating(true);

      const result = await generateAds({
        companyName: data.companyName,
        websiteUrl: data.websiteUrl,
        objective: data.objective,
        product: data.product,
        targetAudience: data.targetAudience,
        brandTone: data.brandTone,
        mindTrigger: data.mindTrigger,
        language: data.language || 'english',
        industry: data.industry,
        platforms: data.platforms,
        companyDescription: data.companyDescription,
        differentials: data.differentials
      });

      if (!result) {
        throw new Error('Failed to generate ads');
      }

      console.log('Generated ad content:', result);
      return result;
    } catch (error) {
      console.error('Error generating ads:', error);
      toast({
        variant: "destructive",
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : 'Failed to generate ads'
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCampaignAds,
    isGenerating
  };
};
