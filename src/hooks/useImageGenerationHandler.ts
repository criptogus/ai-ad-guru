
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { generateAdImage } from "@/services/ads/adGeneration/imageGenerationService";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: (ads: MetaAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  campaignData: any;
}

export const useImageGenerationHandler = ({
  metaAds,
  linkedInAds,
  setMetaAds,
  setLinkedInAds,
  campaignData
}: UseImageGenerationHandlerProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      toast.error("Descrição da imagem ausente", {
        description: "Não foi possível gerar a imagem sem uma descrição"
      });
      return;
    }
    
    setLoadingImageIndex(index);
    
    try {
      console.log("Generating image for ad:", ad);
      
      // Add additional context for image generation
      const platform = campaignData?.platforms?.includes('meta') ? 'meta' : 'linkedin';
      const format = ad.format || 'square';
      
      // Call the image generation service
      const imageUrl = await generateAdImage({
        prompt: ad.imagePrompt,
        platform,
        format: format as 'square' | 'story' | 'horizontal',
        style: format === 'story' ? 'vibrant' : 'professional'
      });
      
      if (imageUrl) {
        toast.success("Imagem gerada com sucesso!");
        
        // Update the appropriate ad array
        if (platform === 'meta' && metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
          console.log("Meta ad updated with new image:", imageUrl);
        } else if (platform === 'linkedin' && linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
          console.log("LinkedIn ad updated with new image:", imageUrl);
        }
      } else {
        throw new Error("Não foi possível gerar a imagem");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Falha ao gerar imagem", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
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
