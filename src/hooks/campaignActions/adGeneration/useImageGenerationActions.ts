
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getCreditCosts, consumeCredits } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

export const useImageGenerationActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
  const creditCosts = getCreditCosts();

  // Generate image for Meta ad
  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    setImageGenerationError(null);
    
    if (!ad.imagePrompt) {
      setImageGenerationError("Image prompt is required");
      toast.error("Image Prompt Required", {
        description: "Please provide an image prompt",
        duration: 5000,
      });
      return;
    }

    if (!user) {
      toast.error("Authentication Required", {
        description: "Please log in to generate images",
        duration: 5000,
      });
      return;
    }

    console.log("Generating image for ad:", ad);
    console.log("With prompt:", ad.imagePrompt);
    console.log("Using analysis result:", analysisResult);
    
    try {
      // Show credit usage preview
      toast.info("Credit Usage Preview", {
        description: `This will use ${creditCosts.imageGeneration} credits to generate this Instagram ad image`,
        duration: 3000,
      });
      
      // Consume credits before generating the image
      const creditSuccess = await consumeCredits(
        user.id,
        creditCosts.imageGeneration,
        'image_generation',
        `Instagram ad image for "${ad.headline}"`
      );
      
      if (!creditSuccess) {
        toast.error("Insufficient Credits", {
          description: "You don't have enough credits to generate this image",
          duration: 5000,
        });
        return;
      }
      
      // Add image format preference based on Instagram ad best practices
      const imageFormat = "square"; // Default to square format for Instagram ads
      
      // Pass additional context from the analysis result to enhance image generation
      const additionalInfo = {
        ...(analysisResult ? {
          companyName: analysisResult.companyName,
          brandTone: analysisResult.brandTone,
          targetAudience: analysisResult.targetAudience,
          uniqueSellingPoints: analysisResult.uniqueSellingPoints
        } : {}),
        imageFormat
      };
      
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
        
        toast.success("Image Generated", {
          description: `Ad image was successfully created using ${creditCosts.imageGeneration} credits`,
          duration: 3000,
        });
      } else {
        throw new Error("Image generation returned null");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setImageGenerationError(error instanceof Error ? error.message : "Unknown error");
      toast.error("Image Generation Failed", {
        description: "Failed to generate image. Please try again.",
        duration: 5000,
      });
      
      // Refund credits on failure
      if (user) {
        await consumeCredits(
          user.id,
          -creditCosts.imageGeneration, // Negative amount to refund
          'credit_refund',
          'Refund for failed image generation'
        );
      }
      
      throw error; // Re-throw to allow component-level handling
    }
  };

  return {
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError: () => setImageGenerationError(null)
  };
};
