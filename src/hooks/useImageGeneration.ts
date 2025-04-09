
import { useState } from 'react';
import { MetaAd } from '@/hooks/adGeneration/types';
import { CampaignData } from '@/contexts/CampaignContext';

// Define o tipo correto para a função de geração de imagem
type GenerateImageFn = (prompt: string, additionalContext?: any) => Promise<string | null>;

export const useImageGeneration = (
  generateAdImage: GenerateImageFn,
  metaAds: MetaAd[],
  linkedInAds: MetaAd[],
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>,
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>,
  campaignData: CampaignData
) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImageWrapper = async (prompt: string, additionalContext?: any): Promise<string | null> => {
    try {
      const result = await generateAdImage(prompt, additionalContext);
      return typeof result === 'string' ? result : null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      setLoadingImageIndex(index);
      
      // Create prompt with context
      const promptWithContext = `${ad.imagePrompt || ad.description}. Brand: ${campaignData?.name || ''}, Industry: ${campaignData?.description || ''}`;
      
      // Add format context if it exists, using optional chaining
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      const imageUrl = await handleGenerateImageWrapper(finalPrompt, {
        ad,
        campaignData,
        index
      });

      if (imageUrl) {
        // Create a new updated ad object with the image URL
        const updatedAd: MetaAd = { 
          ...ad, 
          imageUrl 
        };
        
        // Update the appropriate ads array based on which ad type it is
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = updatedAd;
          setLinkedInAds(updatedAds);
        }
      }
    } catch (error) {
      console.error("Error in handleGenerateImage:", error);
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    loadingImageIndex,
    handleGenerateImage
  };
};
