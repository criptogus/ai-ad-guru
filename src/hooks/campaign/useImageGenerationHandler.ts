
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/contexts/CampaignContext";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | any>;
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  campaignData: CampaignData;
}

export const useImageGenerationHandler = ({
  generateAdImage,
  metaAds,
  linkedInAds,
  setMetaAds,
  setLinkedInAds,
  campaignData
}: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    try {
      setLoadingImageIndex(index);
      const promptWithContext = `${ad.imagePrompt || ad.description}. Brand: ${campaignData.name}, Industry: ${campaignData.description}`;
      
      // Add format context if it exists
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      // Pass the ad and campaignData as additionalInfo
      const result = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        index
      });
      
      // Extract the image URL from the result, handling different return types
      let imageUrl: string | null = null;
      
      if (typeof result === 'string') {
        imageUrl = result;
      } else if (result && typeof result === 'object') {
        imageUrl = result.imageUrl || null;
      }

      // Update the ad array if we got a valid URL
      if (imageUrl) {
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};
