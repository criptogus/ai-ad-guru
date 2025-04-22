
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/contexts/CampaignContext";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | any>;
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  campaignData: CampaignData;
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
    try {
      setLoadingImageIndex(index);
      toast.info("Generating image...", { duration: 3000 });
      
      // Extract prompt text from the ad
      const promptText = ad.imagePrompt || ad.description || ad.primaryText?.split('#')[0] || "";
      if (!promptText.trim()) {
        toast.error("No valid image prompt found");
        throw new Error("No valid image prompt found");
      }
      
      // Create a comprehensive prompt with context
      const promptWithContext = `Create a high-quality Instagram ad image: ${promptText}. Brand: ${campaignData.name || 'Your Brand'}, Industry: ${campaignData.description || 'Business'}`;
      
      // Add format context if it exists
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      console.log("Image generation starting with prompt:", finalPrompt);
      
      // Pass the ad and campaignData as additionalInfo
      const result = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        format: ad.format || 'feed',
        adType: 'instagram'
      });
      
      // Extract the image URL from the result, handling different return types
      let imageUrl: string | null = null;
      
      if (typeof result === 'string') {
        imageUrl = result;
      } else if (result && typeof result === 'object') {
        imageUrl = result.imageUrl || null;
      }

      console.log("Image generation result:", imageUrl);
      
      // Update the ad array if we got a valid URL
      if (imageUrl) {
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
          toast.success("Image generated successfully");
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
          toast.success("Image generated successfully");
        }
      } else {
        toast.error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
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
