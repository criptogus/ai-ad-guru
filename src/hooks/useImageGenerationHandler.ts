
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
      // Log the image prompt being used
      console.log("Starting image generation for ad:", ad);
      console.log("Using image prompt:", ad.imagePrompt);
      
      const platform = campaignData?.platforms?.includes('meta') ? 'meta' : 'linkedin';
      
      // Generate image using the specific image prompt from the ad
      const imageUrl = await generateAdImage({
        prompt: ad.imagePrompt,
        platform,
        format: ad.format || 'square',
        industry: campaignData?.industry,
        brandTone: campaignData?.brandTone || 'professional',
        campaignObjective: campaignData?.objective,
        targetAudience: campaignData?.targetAudience,
        language: campaignData?.language || 'portuguese'
      });
      
      if (imageUrl) {
        toast.success("Imagem gerada com sucesso!");
        
        // Update the correct ad array based on platform
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
