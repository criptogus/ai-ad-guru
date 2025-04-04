
import { useState, useCallback } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";
import { generateAdImage, generateBannerImage } from "@/services/ads/adGeneration/imageGenerationService";

interface UseImageGenerationHandlerProps {
  handleGenerateImage?: (imagePrompt: string, index: number, additionalInfo?: any) => Promise<string | null>;
  useCustomHandler?: boolean;
}

export const useImageGenerationHandler = ({ 
  handleGenerateImage,
  useCustomHandler = false
}: UseImageGenerationHandlerProps = {}) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const defaultGenerateImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    try {
      const platform = additionalInfo?.platform || 'meta';
      const format = additionalInfo?.format || 'square';
      const brandTone = additionalInfo?.brandTone || 'professional';
      
      return await generateAdImage({
        prompt,
        platform: platform as 'meta' | 'linkedin',
        format: format as 'square' | 'story' | 'horizontal',
        brandTone
      });
    } catch (error) {
      console.error('Error in default image generation:', error);
      return null;
    }
  };

  const generateImage = useCustomHandler && handleGenerateImage ? handleGenerateImage : defaultGenerateImage;

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
      
      // Pass additional context from the ad to help with image generation
      const additionalInfo = {
        headline: ad.headline,
        primaryText: ad.primaryText,
        description: ad.description,
        format: ad.format || "feed",
        platform: "meta"
      };
      
      const imageUrl = await generateImage(ad.imagePrompt, index, additionalInfo);
      
      if (imageUrl) {
        toast.success("Image generated successfully", {
          description: "5 credits were used for AI image generation"
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
  }, [generateImage]);

  // Function to generate banner images
  const handleGenerateBannerImage = useCallback(async (
    prompt: string,
    options?: {
      platform?: string,
      format?: string,
      templateType?: string,
      templateName?: string,
      templateId?: string,
      brandTone?: string
    }
  ) => {
    try {
      setIsGenerating(true);
      
      const result = await generateBannerImage(
        prompt,
        options?.platform,
        options?.format,
        options?.templateType,
        options?.templateName,
        options?.templateId,
        options?.brandTone
      );
      
      if (result && result.imageUrl) {
        toast.success("Banner image generated successfully", {
          description: "10 credits were used for AI banner generation with DALL-E 3"
        });
        return result;
      } else {
        toast.error("Failed to generate banner image", {
          description: "Please try again or use a different prompt"
        });
        return null;
      }
    } catch (error) {
      console.error("Error generating banner image:", error);
      toast.error("Error generating banner image", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    loadingImageIndex,
    isGenerating,
    handleGenerateImageForAd,
    handleGenerateBannerImage
  };
};
