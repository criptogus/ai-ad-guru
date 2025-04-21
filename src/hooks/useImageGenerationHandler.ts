
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/hooks/useCampaignState";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
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
      
      // Extract prompt text from the ad
      const promptText = ad.imagePrompt || ad.description || "";
      const promptWithContext = `${promptText}. Brand: ${campaignData.name || 'Brand'}, Industry: ${campaignData.description || 'Business'}`;
      
      // Add format context if it exists
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      // Generate the image
      const imageUrl = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        index
      });
      
      // Update the ad with the new image URL if successful
      if (imageUrl) {
        // Check if this is a Meta ad
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } 
        // Check if this is a LinkedIn ad
        else if (linkedInAds[index]) {
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
