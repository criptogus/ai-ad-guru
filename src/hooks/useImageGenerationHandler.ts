
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { CampaignData } from "@/contexts/CampaignContext";
import { toast } from "sonner";

interface UseImageGenerationHandlerProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | any>;
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  campaignData: CampaignData;
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
    try {
      setLoadingImageIndex(index);
      
      // Extrair texto do prompt da imagem
      const promptText = ad.imagePrompt || ad.description || "";
      if (!promptText.trim()) {
        toast.error("Prompt de imagem ausente", {
          description: "Por favor, forneça um prompt de imagem ou descrição para gerar a imagem"
        });
        return;
      }
      
      // Construir um prompt abrangente com contexto
      const promptWithContext = `Create an Instagram ad for ${campaignData.name || 'a brand'}. ${promptText}`;
      
      // Adicionar contexto de formato se existir
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      
      // Incluir detalhes da marca e preferências de estilo
      const brandContext = `. Brand colors and style: ${campaignData.brandTone || 'professional'}`;
      
      const finalPrompt = promptWithContext + formatContext + brandContext;
      
      console.log("Gerando imagem com prompt:", finalPrompt);
      
      // Passar o ad e campaignData como additionalInfo
      const result = await generateAdImage(finalPrompt, {
        ad,
        campaignData,
        index,
        platform: "instagram",
        format: ad.format || "feed",
        adType: "social_media"
      });
      
      console.log("Resultado da geração de imagem:", result);
      
      // Extrair a URL da imagem do resultado, lidando com diferentes tipos de retorno
      let imageUrl: string | null = null;
      
      if (typeof result === 'string') {
        imageUrl = result;
      } else if (result && typeof result === 'object') {
        imageUrl = result.imageUrl || null;
      }

      console.log("URL final da imagem:", imageUrl);

      // Verificar se a URL da imagem é válida
      if (imageUrl) {
        // Verificar se a URL é válida
        try {
          new URL(imageUrl);
        } catch (e) {
          console.error("URL de imagem inválida:", imageUrl);
          imageUrl = `https://placehold.co/600x600/eeeeee/999999?text=Erro+URL+Inválida`;
          toast.error("URL de imagem inválida", {
            description: "A URL da imagem gerada é inválida"
          });
        }

        // Atualizar o array de anúncios apropriado se obtivemos uma URL válida
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
          
          toast.success("Imagem do Instagram gerada com sucesso", {
            description: "A imagem do seu anúncio foi atualizada"
          });
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setLinkedInAds(updatedAds);
          
          toast.success("Imagem do LinkedIn gerada com sucesso", {
            description: "A imagem do seu anúncio foi atualizada"
          });
        }
      } else {
        // Usar uma imagem de fallback se nenhuma URL válida for retornada
        const fallbackUrl = `https://placehold.co/600x600/eeeeee/999999?text=Imagem+Não+Gerada`;
        
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl: fallbackUrl };
          setMetaAds(updatedAds);
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl: fallbackUrl };
          setLinkedInAds(updatedAds);
        }
        
        toast.error("Falha ao gerar imagem", {
          description: "O serviço de geração de imagem não retornou uma URL válida"
        });
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      
      // Usar uma imagem de fallback em caso de erro
      const fallbackUrl = `https://placehold.co/600x600/eeeeee/999999?text=Erro+na+Geração`;
      
      if (metaAds[index]) {
        const updatedAds = [...metaAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl: fallbackUrl };
        setMetaAds(updatedAds);
      } else if (linkedInAds[index]) {
        const updatedAds = [...linkedInAds];
        updatedAds[index] = { ...updatedAds[index], imageUrl: fallbackUrl };
        setLinkedInAds(updatedAds);
      }
      
      toast.error("Erro ao gerar imagem", {
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido"
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
