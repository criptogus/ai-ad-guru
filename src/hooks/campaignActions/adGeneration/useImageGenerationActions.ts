
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getCreditCosts } from "@/services";

export const useImageGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
  const creditCosts = getCreditCosts();

  // Generate image for Meta ad
  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    setImageGenerationError(null);
    
    if (!ad.imagePrompt) {
      setImageGenerationError("Image prompt is required");
      toast({
        title: "Image Prompt Required",
        description: "Please provide an image prompt",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating image for ad:", ad);
    console.log("With prompt:", ad.imagePrompt);
    console.log("Using analysis result:", analysisResult);
    
    try {
      // Show credit usage preview
      toast({
        title: "Credit Usage Preview",
        description: `This will use ${creditCosts.imageGeneration} credits to generate this Instagram ad image`,
        duration: 3000,
      });
      
      // Pass additional context from the analysis result to enhance image generation
      const additionalInfo = analysisResult ? {
        companyName: analysisResult.companyName,
        brandTone: analysisResult.brandTone,
        targetAudience: analysisResult.targetAudience,
        uniqueSellingPoints: analysisResult.uniqueSellingPoints
      } : undefined;
      
      const imageUrl = await generateAdImage(ad.imagePrompt, additionalInfo);
      console.log("Generated image URL:", imageUrl);
      
      if (imageUrl) {
        // Create a new MetaAd object with the updated imageUrl
        const updatedAd: MetaAd = { ...ad, imageUrl };
        console.log("Updated ad with image:", updatedAd);
        
        // Create a new array with the updated ad
        const updatedAds = [...metaAds];
        updatedAds[index] = updatedAd;
        
        // Update both the Meta ads array and the campaign data
        setCampaignData(prev => {
          console.log("Updating campaign data with new Meta ads:", updatedAds);
          return {
            ...prev,
            metaAds: updatedAds
          };
        });
        
        toast({
          title: "Image Generated",
          description: `Ad image was successfully created using ${creditCosts.imageGeneration} credits`,
        });
      } else {
        throw new Error("Image generation returned null");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImageGenerationError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to allow component-level handling
    }
  };

  return {
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError: () => setImageGenerationError(null)
  };
};
