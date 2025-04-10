
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
      
      // Extract prompt text from the ad
      const promptText = ad.imagePrompt || ad.description || "";
      if (!promptText.trim()) {
        toast.error("Missing image prompt", {
          description: "Please provide an image prompt or description to generate an image"
        });
        return;
      }
      
      // Build a comprehensive prompt with context
      const promptWithContext = `Create an Instagram ad for ${campaignData.name || 'a brand'}. ${promptText}`;
      
      // Add format context if it exists
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      
      // Include brand details and styling preferences
      const brandContext = `. Brand colors and style: ${campaignData.brandTone || 'professional'}`;
      
      const finalPrompt = promptWithContext + formatContext + brandContext;
      
      console.log("Generating image with prompt:", finalPrompt);
      
      // Pass the ad and campaignData as additionalInfo
      const result = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        index,
        platform: "instagram",
        format: ad.format || "feed",
        adType: "social_media"
      });
      
      console.log("Image generation result:", result);
      
      // Extract the image URL from the result, handling different return types
      let imageUrl: string | null = null;
      
      if (typeof result === 'string') {
        imageUrl = result;
      } else if (result && typeof result === 'object') {
        imageUrl = result.imageUrl || null;
      }

      console.log("Final image URL:", imageUrl);

      // Update the ad array if we got a valid URL
      if (imageUrl) {
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
          
          toast.success("Instagram image generated successfully", {
            description: "Your ad image has been updated"
          });
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
          
          toast.success("LinkedIn image generated successfully", {
            description: "Your ad image has been updated"
          });
        }
      } else {
        toast.error("Failed to generate image", {
          description: "The image generation service did not return a valid URL"
        });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Error generating image", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
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
