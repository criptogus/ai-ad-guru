
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
    if (!ad.imagePrompt) {
      console.warn("No image prompt provided for ad:", ad);
      return;
    }
    
    setLoadingImageIndex(index);
    
    try {
      console.log("Generating image for ad:", ad);
      
      // Add additional context for image generation
      const additionalInfo = {
        platform: campaignData?.platforms?.includes('meta') ? 'instagram' : 'linkedin',
        adType: 'feed',
        companyName: campaignData?.name || '',
        industry: campaignData?.industry || '',
        targetAudience: campaignData?.targetAudience || '',
      };
      
      console.log("Calling generateAdImage with prompt:", ad.imagePrompt);
      
      // Use a placeholder image for development/demo purposes
      // This will allow us to see something even if the image generation API isn't working
      const usePlaceholder = true; // Toggle this for testing with placeholder images
      
      let imageUrl = null;
      
      if (usePlaceholder) {
        // Use a placeholder image instead of generating one
        const placeholders = [
          "https://via.placeholder.com/1000x1000?text=Instagram+Ad+Sample",
          "https://via.placeholder.com/800x800?text=Brand+Advertisement",
          "https://via.placeholder.com/1200x1200?text=Product+Showcase"
        ];
        
        // Pick a random placeholder
        imageUrl = placeholders[Math.floor(Math.random() * placeholders.length)];
        console.log("Using placeholder image:", imageUrl);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        // Actually call the image generation service
        imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      }
      
      console.log("Image URL received:", imageUrl);
      
      if (imageUrl) {
        // Update the ad with the new image URL
        if (campaignData?.platforms?.includes('meta') && metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
          console.log("Meta ad updated with new image:", imageUrl);
        } else if (campaignData?.platforms?.includes('linkedin') && linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
          console.log("LinkedIn ad updated with new image:", imageUrl);
        } else {
          console.warn("Could not determine which ad array to update for index:", index);
        }
      } else {
        console.error("No image URL returned from generateAdImage");
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
