
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/hooks/useCampaignState";
import { useToast } from "@/hooks/use-toast";

interface UseImageGenerationHandlerProps {
  metaAds?: MetaAd[];
  linkedInAds?: MetaAd[];
  setMetaAds?: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds?: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  campaignData?: any;
}

export const useImageGenerationHandler = (props?: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleGenerateImage = async (adOrPrompt: MetaAd | string, indexOrAdditionalInfo?: number | any): Promise<string | null> => {
    try {
      // Determine if we're dealing with a MetaAd object or a string prompt
      const isMetaAd = typeof adOrPrompt !== 'string';
      
      // Set loading state
      const index = isMetaAd ? (indexOrAdditionalInfo as number) : (indexOrAdditionalInfo?.index || 0);
      setLoadingImageIndex(index);
      
      // Extract prompt and additional info
      let prompt: string;
      let additionalInfo: any = {};
      
      if (isMetaAd) {
        // If adOrPrompt is a MetaAd object
        const ad = adOrPrompt as MetaAd;
        prompt = ad.imagePrompt || ad.description || ad.primaryText || '';
        additionalInfo = {
          index,
          ad,
          format: ad.format || 'square'
        };
      } else {
        // If adOrPrompt is a string
        prompt = adOrPrompt as string;
        additionalInfo = indexOrAdditionalInfo || {};
      }
      
      // Log the image generation attempt
      console.log(`Generating image with prompt: ${prompt}`);
      console.log('Additional info:', JSON.stringify(additionalInfo, null, 2));
      
      // This is a simplified implementation that returns the imageUrl directly
      // In a real implementation, you would call a service to generate the image
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For testing purposes, return a placeholder image URL
      // In production, this would come from your image generation service
      const imageUrl = "https://placehold.co/600x600/EEE/31343C?text=Generated+Image";
      
      toast({
        title: "Image Generated",
        description: "Ad image successfully created"
      });
      
      // If we have both the ad and the metaAds/linkedInAds state, update it
      if (isMetaAd && props?.metaAds && props?.setMetaAds && index < props.metaAds.length) {
        const updatedAds = [...props.metaAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl };
        props.setMetaAds(updatedAds);
      } else if (isMetaAd && props?.linkedInAds && props?.setLinkedInAds && 
                (props?.metaAds ? index >= props.metaAds.length : true)) {
        const linkedInIndex = props?.metaAds ? index - props.metaAds.length : index;
        if (linkedInIndex < props.linkedInAds.length) {
          const updatedAds = [...props.linkedInAds];
          updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
          props.setLinkedInAds(updatedAds);
        }
      }
      
      return imageUrl;
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Image Generation Failed",
        description: "Could not generate ad image",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};
