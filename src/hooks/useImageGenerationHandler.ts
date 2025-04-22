
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { generateAdImage } from "@/services/ads/adGeneration/imageGenerationService";
import { formatMapping, AdFormat } from "@/types/adFormats";
import { AdPlatform } from "@/services/ads/adGeneration/types";
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
      toast.error("Descrição da imagem ausente");
      return;
    }
    
    setLoadingImageIndex(index);
    
    try {
      const platform: AdPlatform = campaignData?.platforms?.includes('meta') ? 'meta' : 'linkedin';
      
      // Convert the ad format to our generation format
      const adFormat = (ad.format || 'square') as AdFormat;
      const format = formatMapping[adFormat];
      
      const imageUrl = await generateAdImage(ad.imagePrompt, {
        platform,
        format,
        companyName: campaignData?.name || '',
        brandTone: campaignData?.brandTone || 'professional',
        industry: campaignData?.industry || ''
      });
      
      if (imageUrl) {
        toast.success("Imagem gerada com sucesso!");
        
        if (platform === 'meta' && metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else if (platform === 'linkedin' && linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
        }
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
