
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { generateAdImage } from "@/services/ads/adGeneration/imageGenerationService";
import { formatMapping, AdFormat } from "@/types/adFormats";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
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
      console.log("Starting image generation for ad:", ad);
      console.log("Using image prompt:", ad.imagePrompt);
      
      const platform = campaignData?.platforms?.includes('meta') ? 'meta' : 'linkedin';
      
      // Convert the ad format to our generation format using the mapping
      const adFormat = (ad.format || 'square') as AdFormat;
      const format = formatMapping[adFormat];
      
      const imageUrl = await generateAdImage({
        prompt: ad.imagePrompt,
        platform,
        format,
        industry: campaignData?.industry,
        brandTone: campaignData?.brandTone || 'professional',
        campaignObjective: campaignData?.objective,
        targetAudience: campaignData?.targetAudience,
        language: campaignData?.language || 'portuguese'
      });
      
      if (imageUrl) {
        toast.success("Imagem gerada com sucesso!");
        
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
