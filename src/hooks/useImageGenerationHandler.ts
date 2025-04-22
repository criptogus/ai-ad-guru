
import { useState } from 'react';
import { MetaAd } from '@/hooks/adGeneration';
import { generateAdImage } from '@/services/ads/adGeneration/imageGenerationService';
import { useToast } from '@/components/ui/use-toast';

interface UseImageGenerationHandlerProps {
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: (ads: MetaAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  campaignData: any;
}

export const useImageGenerationHandler = ({
  metaAds,
  linkedInAds,
  setMetaAds,
  setLinkedInAds,
  campaignData
}: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    if (!ad.imagePrompt) {
      toast({
        title: "Missing image prompt",
        description: "The ad doesn't have an image prompt to generate an image.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoadingImageIndex(index);
      
      const companyName = campaignData.name || '';
      const additionalInfo = {
        companyName,
        brandTone: campaignData.brandTone || 'professional',
        industry: campaignData.industry || ''
      };
      
      console.log(`Generating image for ad ${index} with prompt: ${ad.imagePrompt}`);
      const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }
      
      // Update the correct ad list based on which one contains this ad
      if (index < metaAds.length) {
        const updatedAds = [...metaAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl };
        setMetaAds(updatedAds);
      } else if (index < (metaAds.length + linkedInAds.length)) {
        // Adjust index for linkedInAds array
        const linkedInIndex = index - metaAds.length;
        const updatedAds = [...linkedInAds];
        updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
        setLinkedInAds(updatedAds);
      }
      
      toast({
        title: "Image generated",
        description: "The ad image has been generated successfully."
      });
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};
