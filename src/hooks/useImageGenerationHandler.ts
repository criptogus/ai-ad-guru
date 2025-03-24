
import { useState, useCallback } from "react";
import { MetaAd } from "@/hooks/adGeneration";

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
      console.warn("No image prompt provided for ad at index", index);
      return;
    }

    try {
      setLoadingImageIndex(index);
      setIsGenerating(true);
      await handleGenerateImage(ad.imagePrompt, index);
    } catch (error) {
      console.error("Error generating image for ad:", error);
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
