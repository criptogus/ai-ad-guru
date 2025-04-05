
import { useState } from 'react';
import { MetaAd } from '@/hooks/adGeneration/types';
import { toast } from 'sonner';

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
  
  const handleGenerateImage = async (adIndex: number, platform: 'meta' | 'linkedin'): Promise<void> => {
    try {
      setLoadingImageIndex(adIndex);
      
      const ads = platform === 'meta' ? metaAds : linkedInAds;
      const ad = ads[adIndex];
      
      if (!ad) {
        toast.error("Ad not found");
        setLoadingImageIndex(null);
        return;
      }
      
      // Extract the image prompt from the ad
      const promptBase = ad.imagePrompt || `Image for ${ad.headline}`;
      const prompt = `${promptBase} for ${campaignData?.companyName || 'a company'} advertisement`;
      
      console.log(`Generating image for ${platform} ad #${adIndex} with prompt:`, prompt);
      
      // Call generateAdImage with the prompt
      const imageUrl = await generateAdImage(prompt, {
        adType: platform,
        headline: ad.headline,
        description: ad.description
      });
      
      if (imageUrl) {
        // Update the ad with the new image URL
        const updatedAds = [...ads];
        updatedAds[adIndex] = {
          ...ad,
          imageUrl: imageUrl
        };
        
        // Update the appropriate ad state
        if (platform === 'meta') {
          setMetaAds(updatedAds);
        } else {
          setLinkedInAds(updatedAds);
        }
        
        toast.success("Image generated successfully");
      } else {
        toast.error("Failed to generate image");
      }
    } catch (error) {
      console.error(`Error generating image for ${platform} ad:`, error);
      toast.error("Error generating image");
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};
