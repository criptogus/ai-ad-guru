
import { useState } from 'react';
import { generateAds } from '@/services/ads/adGeneration/adGenerationService';
import { CampaignPromptData } from '@/services/ads/adGeneration/types';
import { GeneratedAdContent } from '@/services/ads/adGeneration/types';
import { sanitizePromptData } from '@/services/ads/adGeneration/sanitizePromptData';
import { toast } from 'sonner';

export const useAdGenerationFlow = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCampaignAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
    try {
      // Validate required fields
      if (!data.companyName || !data.platforms || data.platforms.length === 0) {
        console.error('Missing required data:', { data });
        toast.error('Dados incompletos para geração', {
          description: 'Nome da empresa e plataformas são obrigatórios.'
        });
        throw new Error('Missing required campaign information');
      }

      // Log the complete data being sent for ad generation
      console.log('Generating ads with data:', JSON.stringify(data, null, 2));
      setIsGenerating(true);

      // 🔒 Sanitize campaign data before prompt
      const promptData: CampaignPromptData = sanitizePromptData(data) as CampaignPromptData;
      console.log('Sanitized prompt data:', JSON.stringify(promptData, null, 2));

      toast.loading('Gerando anúncios...', {
        id: 'generating-ads',
        description: 'Isso pode levar alguns segundos.'
      });

      const result = await generateAds(promptData);
      
      toast.dismiss('generating-ads');
      
      // Check if we got any results
      const hasResults = Object.values(result).some(
        platformAds => Array.isArray(platformAds) && platformAds.length > 0
      );
      
      if (!hasResults) {
        toast.error('Nenhum anúncio foi gerado', {
          description: 'Tente novamente com mais informações sobre sua empresa.'
        });
      }

      console.log('Generated ad content:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('Error generating ads:', error);
      toast.dismiss('generating-ads');
      toast.error('Erro ao gerar anúncios', {
        description: error instanceof Error ? error.message : 'Erro desconhecido'
      });
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
