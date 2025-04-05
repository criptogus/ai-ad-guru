
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/contexts/CampaignContext";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalContext?: any) => Promise<string | null>;
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
      
      const imageUrl = await generateAdImage(finalPrompt, ad);

      if (imageUrl) {
        // Check if this is a Meta ad or LinkedIn ad
        if (index < metaAds.length) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else {
          // If not in metaAds array, it must be a LinkedIn ad
          const linkedInIndex = index - metaAds.length;
          if (linkedInAds[linkedInIndex]) {
            const updatedAds = [...linkedInAds];
            updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
            setLinkedInAds(updatedAds);
          }
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
