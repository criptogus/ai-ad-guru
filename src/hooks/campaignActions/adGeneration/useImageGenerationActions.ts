
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";
import { errorLogger } from "@/services/libs/error-handling";

// Define a type for the global window property
declare global {
  interface Window {
    campaignContext?: {
      analysisResult?: {
        industry?: string;
      };
      [key: string]: any;
    };
  }
}

export const useImageGenerationActions = (
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      toast.error("Image prompt required", {
        description: "Please provide an image prompt to generate an image"
      });
      return;
    }

    try {
      setLoadingImageIndex(index);
      setError(null);

      // Safely access window.campaignContext
      const industry = window.campaignContext?.analysisResult?.industry || "";

      // Add detailed context information from the ad to improve relevance
      const additionalInfo = {
        imagePrompt: ad.imagePrompt,
        platform: "meta",
        headline: ad.headline,
        primaryText: ad.primaryText,
        description: ad.description,
        industry
      };

      console.log(`Generating image with GPT-4o prompt: ${ad.imagePrompt}`);
      console.log("With additional context:", JSON.stringify(additionalInfo));
      
      const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      
      if (!imageUrl) {
        throw new Error("Failed to generate image with GPT-4o");
      }

      console.log(`Generated image URL with GPT-4o: ${imageUrl}`);

      // Update the campaign data with the new image URL
      setCampaignData((prev: any) => {
        const updatedAds = [...prev.metaAds];
        updatedAds[index] = {
          ...updatedAds[index],
          imageUrl
        };
        return {
          ...prev,
          metaAds: updatedAds
        };
      });

      toast.success("Image Generated with GPT-4o", {
        description: "AI-generated image created successfully. 5 credits used."
      });
    } catch (error) {
      errorLogger.logError(error, "handleGenerateImage");
      console.error("Error generating image:", error);
      
      // Use a placeholder image instead
      const placeholderImageUrl = getFallbackImageUrl(ad.imagePrompt || "brand image");
      
      setCampaignData((prev: any) => {
        const updatedAds = [...prev.metaAds];
        updatedAds[index] = {
          ...updatedAds[index],
          imageUrl: placeholderImageUrl
        };
        return {
          ...prev,
          metaAds: updatedAds
        };
      });
      
      setError(error instanceof Error ? error.message : "Failed to generate image with GPT-4o");
      
      toast.error("Using placeholder image", {
        description: "Unable to generate custom image with GPT-4o. Using a placeholder instead."
      });
    } finally {
      setLoadingImageIndex(null);
    }
  };

  // Generate a placeholder image URL based on the prompt
  const getFallbackImageUrl = (prompt: string): string => {
    // Get a random placeholder image from a list of generic business images
    const placeholders = [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    ];
    
    // Use a consistent index based on the prompt to get a deterministic image
    const index = Math.abs(prompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % placeholders.length;
    
    return placeholders[index];
  };

  const clearError = () => {
    setError(null);
  };

  return {
    handleGenerateImage,
    loadingImageIndex,
    error,
    clearError
  };
};
