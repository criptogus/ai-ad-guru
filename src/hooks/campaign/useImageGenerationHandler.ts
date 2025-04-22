
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { useToast } from "@/hooks/use-toast";
import { generateAdImage } from "@/services/ads/adGeneration/imageGenerationService";

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
        
        // Make sure we have a valid image prompt
        if (!ad.imagePrompt) {
          console.error("No image prompt available for ad:", ad);
          toast({
            title: "Image Generation Failed",
            description: "No image prompt available for this ad. Try regenerating the ad.",
            variant: "destructive"
          });
          setLoadingImageIndex(null);
          return null;
        }
        
        prompt = ad.imagePrompt;
        additionalInfo = {
          index,
          adType: "instagram",
          companyName: props?.campaignData?.companyName || "",
          industry: props?.campaignData?.industry || "",
          targetAudience: props?.campaignData?.targetAudience || "",
          brandTone: props?.campaignData?.brandTone || "professional",
          format: ad.format || 'square'
        };
        
        // Log for debugging
        console.log(`🖼️ Generating Instagram Ad image for index [${index}]`);
        console.log(`📝 Using prompt: ${prompt}`);
        console.log(`📊 With additional context:`, additionalInfo);
      } else {
        // If adOrPrompt is a string
        prompt = adOrPrompt as string;
        additionalInfo = indexOrAdditionalInfo || {};
        console.log(`🖼️ Generating image with direct prompt: ${prompt.substring(0, 100)}...`);
      }
      
      // Show generating toast
      toast({
        title: "Generating Image",
        description: "Creating ad image using AI. This may take a moment...",
      });
      
      // Call the image generation service
      const imageUrl = await generateAdImage(prompt, additionalInfo);
      console.log(`✅ Image generation result:`, imageUrl ? "Success" : "Failed");
      
      if (!imageUrl) {
        throw new Error("Image generation service returned no image URL");
      }
      
      // Update success toast
      toast({
        title: "Image Generated",
        description: "Ad image successfully created"
      });
      
      // If we have both the ad and the metaAds/linkedInAds state, update it
      if (isMetaAd && props?.metaAds && props?.setMetaAds && index < props.metaAds.length) {
        const updatedAds = [...props.metaAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl };
        props.setMetaAds(updatedAds);
        console.log(`✅ Updated metaAds at index ${index} with new image URL`);
      } else if (isMetaAd && props?.linkedInAds && props?.setLinkedInAds && 
                (props?.metaAds ? index >= props.metaAds.length : true)) {
        const linkedInIndex = props?.metaAds ? index - props.metaAds.length : index;
        if (linkedInIndex < props.linkedInAds.length) {
          const updatedAds = [...props.linkedInAds];
          updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
          props.setLinkedInAds(updatedAds);
          console.log(`✅ Updated linkedInAds at index ${linkedInIndex} with new image URL`);
        }
      }
      
      return imageUrl;
    } catch (error) {
      console.error("🚨 Image generation error:", error);
      toast({
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate ad image",
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
