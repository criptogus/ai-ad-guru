
import { useState } from 'react';
import { MetaAd } from '@/hooks/adGeneration/types';
import { CampaignData } from '@/contexts/CampaignContext';
import { toast } from 'sonner';

// Updated type definition to match the actual structure of the generateAdImage function
type GenerateImageFn = (prompt: string, additionalContext?: any) => Promise<string | null>;

export const useImageGeneration = (
  generateAdImage: GenerateImageFn,
  metaAds: MetaAd[],
  linkedInAds: MetaAd[],
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>,
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>,
  campaignData: CampaignData
) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      setLoadingImageIndex(index);
      
      // Validate image prompt
      if (!ad.imagePrompt) {
        toast.error("Não foi possível gerar imagem", {
          description: "Este anúncio não tem um prompt de imagem definido"
        });
        setLoadingImageIndex(null);
        return;
      }
      
      // Show toast notification
      toast.info("Gerando imagem do anúncio", {
        description: "Isso pode levar alguns segundos..."
      });
      
      // Create prompt with context
      const promptWithContext = `${ad.imagePrompt}. Brand: ${campaignData?.name || ''}, Industry: ${campaignData?.description || ''}`;
      
      // Add format context if it exists, using optional chaining
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      console.log("Generating image with prompt:", finalPrompt);
      
      // Call the generateAdImage function with the prompt string
      const imageUrl = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        index,
        adType: "instagram",
        format: ad.format || "square"
      });

      if (imageUrl) {
        console.log("Image generated successfully:", imageUrl);
        
        // Create a new updated ad object with the image URL
        const updatedAd: MetaAd = { 
          ...ad, 
          imageUrl 
        };
        
        // Update the appropriate ads array based on which ad type it is
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
          
          toast.success("Imagem gerada com sucesso", {
            description: "A imagem foi adicionada ao seu anúncio"
          });
        } else if (linkedInAds[index - (metaAds.length || 0)]) {
          const linkedInIndex = index - (metaAds.length || 0);
          const updatedAds = [...linkedInAds];
          updatedAds[linkedInIndex] = updatedAd;
          setLinkedInAds(updatedAds);
          
          toast.success("Imagem gerada com sucesso", {
            description: "A imagem foi adicionada ao seu anúncio"
          });
        }
      } else {
        throw new Error("Não foi possível gerar a imagem");
      }
    } catch (error) {
      console.error("Error in handleGenerateImage:", error);
      toast.error("Falha ao gerar imagem", {
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido"
      });
    } finally {
      setLoadingImageIndex(null);
    }
  };

  return {
    loadingImageIndex,
    handleGenerateImage
  };
};
