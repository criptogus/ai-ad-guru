
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { generateAdImage } from "@/services/ads/adGeneration/imageGenerationService";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  generateAdImage: (params: any) => Promise<string | null>;
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: (ads: MetaAd[]) => void;
  setLinkedInAds: (ads: MetaAd[]) => void;
  campaignData: any;
}

export const useImageGenerationHandler = ({
  generateAdImage,
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
      const additionalInfo = {
        platform: campaignData?.platforms?.includes('meta') ? 'instagram' : 'linkedin',
        adType: 'feed',
        companyName: campaignData?.name || '',
        industry: campaignData?.description || '',
        targetAudience: campaignData?.targetAudience || '',
        format: ad.format || 'square',
        language: 'portuguese' // Ensure Portuguese language
      };
      
      console.log("Calling generateAdImage with prompt:", ad.imagePrompt);
      
      // Generate unique filename based on timestamp and ad content
      const timestamp = Date.now();
      const imageName = `ad-${timestamp}-${index}.png`;
      
      // Call the image generation service with language and branding context
      // Fix: Pass the parameters as an object with the correct structure
      let imageUrl = await generateAdImage({
        prompt: `${ad.imagePrompt}. Em português brasileiro. Marca: ${additionalInfo.companyName}`,
        platform: additionalInfo.platform as 'meta' | 'linkedin' | 'google',
        format: additionalInfo.format as 'square' | 'story' | 'horizontal' | undefined,
        style: ad.format === 'story' ? 'vibrant' : 'professional' // Use format instead of brandTone
      });
      
      console.log("Image URL received:", imageUrl);
      
      if (imageUrl) {
        // Add cache-busting parameter to the URL
        const cacheBuster = `t=${Date.now()}`;
        imageUrl = imageUrl.includes('?') 
          ? `${imageUrl}&${cacheBuster}` 
          : `${imageUrl}?${cacheBuster}`;
          
        toast.success("Imagem gerada com sucesso!");
          
        // Update the ad with the new image URL
        if (campaignData?.platforms?.includes('meta') && metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
          console.log("Meta ad updated with new image:", imageUrl);
        } else if (campaignData?.platforms?.includes('linkedin') && linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
          console.log("LinkedIn ad updated with new image:", imageUrl);
        } else {
          console.warn("Could not determine which ad array to update for index:", index);
        }
      } else {
        toast.error("Falha ao gerar imagem", {
          description: "O serviço de geração de imagens não retornou uma URL válida"
        });
        console.error("No image URL returned from generateAdImage");
      }
    } catch (error) {
      toast.error("Erro ao gerar imagem", {
        description: error instanceof Error ? error.message : "Erro desconhecido"
      });
      console.error("Error generating image:", error);
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    handleGenerateImage,
    loadingImageIndex
  };
};
