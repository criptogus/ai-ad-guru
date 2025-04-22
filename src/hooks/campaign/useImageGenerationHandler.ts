
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/hooks/useCampaignState";
import { useToast } from "@/hooks/use-toast";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
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
  const { toast } = useToast();

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    try {
      setLoadingImageIndex(index);
      
      // Create prompt with context
      const promptWithContext = `${ad.imagePrompt || ad.description}. Brand: ${campaignData?.name || ''}, Industry: ${campaignData?.description || ''}`;
      
      // Add format context if it exists, using optional chaining
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      // Call the generateAdImage function with the prompt string
      const imageUrl = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        index
      });

      if (imageUrl) {
        // Update the ad array based on which array it belongs to
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
        }
        
        toast({
          title: "Image Generated",
          description: "Ad image successfully created"
        });
      }
    } catch (error) {
      console.error("Image generation error:", error);
      toast({
        title: "Image Generation Failed",
        description: "Could not generate ad image",
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
