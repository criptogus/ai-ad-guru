
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { generateAdImage } from "@/services/ads/adGeneration/imageGenerationService";
import { formatMapping, AdFormat } from "@/types/adFormats";
import { AdPlatform } from "@/services/ads/adGeneration/types";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
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

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      toast.error("Image prompt is missing", {
        description: "Please provide a description for the image you want to generate"
      });
      return;
    }
    
    setLoadingImageIndex(index);
    
    try {
      // Determine which platform we're generating for
      const platform: AdPlatform = campaignData?.platforms?.includes('meta') ? 'meta' : 'linkedin';
      
      // Convert the ad format to our generation format
      const adFormat = (ad.format || 'square') as AdFormat;
      const format = formatMapping[adFormat] || 'square';
      
      // Add campaign context to the prompt for better results
      const enhancedPrompt = `${ad.imagePrompt}
Brand: ${campaignData?.name || campaignData?.companyName || ''}
Industry: ${campaignData?.industry || ''}
Target audience: ${campaignData?.targetAudience || ''}`;
      
      // Generate the image
      const imageUrl = await generateAdImage(enhancedPrompt, {
        platform,
        format,
        companyName: campaignData?.name || campaignData?.companyName || '',
        brandTone: campaignData?.brandTone || 'professional',
        industry: campaignData?.industry || ''
      });
      
      if (imageUrl) {
        toast.success("Image generated successfully");
        
        // Update the appropriate ad array
        if (platform === 'meta' && metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else if (platform === 'linkedin' && linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
        }
      } else {
        throw new Error("Failed to generate image: No image URL returned");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
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
