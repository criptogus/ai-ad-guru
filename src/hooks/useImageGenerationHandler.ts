
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
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

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) return;
    
    setLoadingImageIndex(index);
    
    try {
      console.log("Generating image for ad:", ad);
      
      // Add additional context for image generation
      const additionalInfo = {
        platform: campaignData?.platforms?.includes('meta') ? 'instagram' : 'linkedin',
        adType: 'feed',
        companyName: campaignData?.companyName || '',
        industry: campaignData?.industry || '',
        targetAudience: campaignData?.targetAudience || '',
      };
      
      const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      
      if (imageUrl) {
        // Update the ad with the new image URL
        if (additionalInfo.platform === 'instagram') {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else {
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
