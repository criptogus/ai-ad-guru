
import { MetaAd } from "@/hooks/adGeneration";
import { useState } from "react";

export const useImageGenerationHandler = (
  generateAdImage: (prompt: string) => Promise<string | null>,
  metaAds: MetaAd[],
  linkedInAds: any[],
  setMetaAds: (ads: MetaAd[]) => void,
  setLinkedInAds: (ads: any[]) => void,
  campaignData: any
) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) return;
    
    setLoadingImageIndex(index);
    
    try {
      const imageUrl = await generateAdImage(ad.imagePrompt);
      
      if (imageUrl) {
        const updatedAd = { ...ad, imageUrl };
        
        const platform = campaignData.currentEditingPlatform || "meta";
        
        if (platform === "meta") {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
        } else if (platform === "linkedin") {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = updatedAd;
          setLinkedInAds(updatedAds);
        }
      }
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};
