import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import { checkUserCredits, deductUserCredits } from "@/services/credits/creditChecks";
import { useAuth } from "@/contexts/AuthContext";
import { getCreditCost } from "@/services/credits/creditCosts";

export const useImageGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);

  const clearImageGenerationError = () => setImageGenerationError(null);

  const handleGenerateImage = async (prompt: string, indexOrOptions: number | any = 0) => {
    const index = typeof indexOrOptions === 'number' ? indexOrOptions : 0;
    const options = typeof indexOrOptions === 'object' ? indexOrOptions : {};
    
    if (!prompt) {
      setImageGenerationError("Image prompt is required");
      return null;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate images",
        variant: "destructive",
      });
      return null;
    }

    const imageCost = getCreditCost('imageGeneration');
    const hasCredits = await checkUserCredits(user.id, imageCost);

    if (!hasCredits) {
      toast({
        title: "Insufficient Credits",
        description: `You need ${imageCost} credits to generate an image`,
        variant: "destructive",
      });
      return null;
    }

    try {
      let enhancedPrompt = prompt;
      if (analysisResult) {
        enhancedPrompt += ` Style should match the brand tone: ${analysisResult.brandTone}.`;
      }

      if (options.platform) {
        enhancedPrompt += ` Optimize for ${options.platform} platform.`;
      }

      console.log("Generating image with prompt:", enhancedPrompt);
      
      const creditSuccess = await deductUserCredits(
        user.id,
        imageCost,
        'image_generation',
        'Ad image generation'
      );

      if (!creditSuccess) {
        setImageGenerationError("Failed to deduct credits for image generation");
        return null;
      }

      const imageUrl = await generateAdImage(enhancedPrompt, options);
      
      if (!imageUrl) {
        throw new Error("Failed to generate image");
      }

      const updatedAds = [...metaAds];
      if (updatedAds[index]) {
        updatedAds[index] = {
          ...updatedAds[index],
          imageUrl
        };
        
        setCampaignData((prev: any) => ({
          ...prev,
          metaAds: updatedAds
        }));
      }

      toast({
        title: "Image Generated",
        description: "AI has created an image for your ad",
      });

      return imageUrl;
    } catch (error) {
      console.error("Error generating image:", error);
      setImageGenerationError(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Image Generation Failed",
        description: "There was an error generating your image",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError
  };
};
