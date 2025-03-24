
import { useState, useCallback } from "react";
import { MetaAd } from "@/hooks/adGeneration";

interface UseImageGenerationHandlerProps {
  handleGenerateImage: (imagePrompt: string, index: number) => Promise<void>;
}

export const useImageGenerationHandler = ({ 
  handleGenerateImage 
}: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImageForAd = useCallback(async (ad: MetaAd, index: number): Promise<void> => {
    try {
      setLoadingImageIndex(index);
      setIsGenerating(true);
      await handleGenerateImage(ad.imagePrompt, index);
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
