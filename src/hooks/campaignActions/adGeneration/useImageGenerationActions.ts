
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";

interface UseImageGenerationActionsProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useImageGenerationActions = ({
  generateAdImage,
  setCampaignData
}: UseImageGenerationActionsProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      setError("No image prompt provided");
      return;
    }
    
    setLoadingImageIndex(index);
    setError(null);
    
    try {
      const imageUrl = await generateAdImage(ad.imagePrompt, {
        adType: "instagram",
        adContext: ad
      });
      
      if (imageUrl) {
        // Update the ad with the new image URL
        setCampaignData((prev: any) => {
          // Determine which ad array to update
          let adArray = [...(prev.linkedInAds || [])];
          let adArrayKey = "linkedInAds";
          
          // Check if this is a Meta ad
          if (prev.metaAds && prev.metaAds.length > index && prev.metaAds[index].primaryText === ad.primaryText) {
            adArray = [...prev.metaAds];
            adArrayKey = "metaAds";
          }
          
          // Update the ad at the specified index
          if (adArray.length > index) {
            adArray[index] = {
              ...adArray[index],
              imageUrl
            };
          }
          
          return {
            ...prev,
            [adArrayKey]: adArray
          };
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error generating image");
      console.error("Error generating image:", e);
    } finally {
      setLoadingImageIndex(null);
    }
  };
  
  const clearError = () => setError(null);
  
  return {
    handleGenerateImage,
    loadingImageIndex,
    error,
    clearError
  };
};
