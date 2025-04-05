
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface ImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  campaignData: any;
}

export const useImageGenerationHandler = ({
  generateAdImage,
  metaAds,
  linkedInAds,
  setMetaAds,
  setLinkedInAds,
  campaignData
}: ImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) return;
    
    setLoadingImageIndex(index);
    
    try {
      // Create additional context object for image generation
      const additionalInfo = {
        platform: campaignData?.currentEditingPlatform || "meta",
        format: ad.format || "feed",
        userId: campaignData?.userId,
        // Add any other relevant context
      };
      
      const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      
      if (imageUrl) {
        const updatedAd = { ...ad, imageUrl };
        
        const platform = campaignData?.currentEditingPlatform || "meta";
        
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
