
import { MetaAd } from "@/hooks/adGeneration";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalContext?: any) => Promise<string | null>;
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: (ads: MetaAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  campaignData: any;
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

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      if (!ad.imagePrompt) return;
      
      setLoadingImageIndex(index);
      
      const imageUrl = await generateAdImage(ad.imagePrompt, {
        companyName: campaignData?.companyName,
        businessDescription: campaignData?.businessDescription,
        ...campaignData
      });
      
      if (imageUrl) {
        // Create a copy of the ad with the updated image URL
        const updatedAd = { ...ad, imageUrl };
        
        // Figure out which ad array this ad belongs to
        if (metaAds.some(metaAd => metaAd === ad)) {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
        } else if (linkedInAds.some(linkedInAd => linkedInAd === ad)) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = updatedAd;
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

// Add missing import
import { useState } from "react";
