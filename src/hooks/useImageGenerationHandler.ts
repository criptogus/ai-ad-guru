
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
    // Determine the prompt to use
    const prompt = ad.imagePrompt || ad.description || ad.primaryText?.split('#')[0] || "";
    
    if (!prompt) {
      toast({
        title: "Missing image prompt",
        description: "The ad doesn't have enough content to generate an image.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoadingImageIndex(index);
      toast({
        title: "Generating image...",
        description: "This may take a few moments.",
      });
      
      const companyName = campaignData.name || '';
      const additionalInfo = {
        companyName,
        brandTone: campaignData.brandTone || 'professional',
        industry: campaignData.industry || '',
        format: ad.format || 'square', // Make sure format is passed
        adType: 'instagram'
      };
      
      console.log(`Generating image for ad ${index} with prompt: ${prompt}`);
      console.log(`Additional info:`, additionalInfo);
      
      const imageUrl = await generateAdImage(prompt, additionalInfo);
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }
      
      console.log(`Image generated successfully: ${imageUrl}`);
      
      // Update the correct ad list based on which one contains this ad
      if (index < metaAds.length) {
        const updatedAds = [...metaAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl };
        setMetaAds(updatedAds);
        
        console.log(`Updated Meta ad at index ${index} with new image URL`);
      } else if (index < (metaAds.length + linkedInAds.length)) {
        // Adjust index for linkedInAds array
        const linkedInIndex = index - metaAds.length;
        const updatedAds = [...linkedInAds];
        updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
        setLinkedInAds(updatedAds);
        
        console.log(`Updated LinkedIn ad at index ${linkedInIndex} with new image URL`);
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
