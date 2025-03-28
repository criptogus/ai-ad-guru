
import { useState, useCallback } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  handleGenerateImage: (imagePrompt: string, index: number) => Promise<string | null>;
}

export const useImageGenerationHandler = ({ 
  handleGenerateImage 
}: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImageForAd = useCallback(async (ad: MetaAd, index: number): Promise<void> => {
    if (!ad.imagePrompt) {
      toast.error("No image prompt provided", {
        description: "Please provide a description of the image you want to generate"
      });
      return;
    }

    try {
      setLoadingImageIndex(index);
      setIsGenerating(true);
      
      console.log(`Generating image for ad at index ${index} with prompt: ${ad.imagePrompt}`);
      const imageUrl = await handleGenerateImage(ad.imagePrompt, index);
      
      if (imageUrl) {
        toast.success("Image generated successfully", {
          description: "5 credits were used for AI image generation with GPT-4o"
        });
      } else {
        toast.error("Failed to generate image", {
          description: "Please try again or use a different prompt"
        });
      }
    } catch (error) {
      console.error("Error generating image for ad:", error);
      toast.error("Error generating image", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    } finally {
      setLoadingImageIndex(null);
      setIsGenerating(false);
    }
  }, [handleGenerateImage]);

  return {
    loadingImageIndex,
    isGenerating,
    handleGenerateImageForAd
  };
};
