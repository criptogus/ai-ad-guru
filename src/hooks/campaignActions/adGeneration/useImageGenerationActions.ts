
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { toast } from "sonner";

interface UseImageGenerationActionsProps {
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useImageGenerationActions = ({
  generateAdImage,
  setCampaignData
}: UseImageGenerationActionsProps) => {
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) {
      setError("Nenhum prompt de imagem fornecido");
      toast.error("Falha ao gerar imagem", {
        description: "Este anúncio não possui um prompt de imagem."
      });
      return;
    }
    
    setLoadingImageIndex(index);
    setError(null);
    
    try {
      console.log(`Gerando imagem para anúncio ${index} com prompt:`, ad.imagePrompt);
      
      const imageUrl = await generateAdImage(ad.imagePrompt, {
        adType: "instagram",
        adContext: ad
      });
      
      if (imageUrl) {
        console.log(`Imagem gerada com sucesso para anúncio ${index}:`, imageUrl);
        
        // Atualizar o anúncio com a nova URL da imagem
        setCampaignData((prev: any) => {
          // Determinar qual array de anúncios atualizar
          let adArray = [...(prev.metaAds || [])];
          let adArrayKey = "metaAds";
          
          // Verificar se é um anúncio Meta ou LinkedIn
          if (prev.linkedInAds && prev.linkedInAds.length > index && isMatchingAd(prev.linkedInAds[index], ad)) {
            adArray = [...prev.linkedInAds];
            adArrayKey = "linkedInAds";
          }
          
          // Atualizar o anúncio no índice especificado
          if (adArray.length > index) {
            adArray[index] = {
              ...adArray[index],
              imageUrl
            };
            
            // Verificar se a atualização foi bem-sucedida
            if (adArray[index].imageUrl !== imageUrl) {
              console.warn(`Aviso: A atualização da URL da imagem não foi registrada corretamente para ${adArrayKey}[${index}]`);
            } else {
              console.log(`URL da imagem atualizada com sucesso para ${adArrayKey}[${index}]`);
            }
          }
          
          return {
            ...prev,
            [adArrayKey]: adArray
          };
        });
        
        toast.success("Imagem gerada com sucesso", {
          description: "A imagem do anúncio foi criada pela IA."
        });
      } else {
        setError("Não foi possível gerar a imagem");
        console.error(`Falha ao gerar imagem para anúncio ${index}: URL nula retornada`);
        toast.error("Falha ao gerar imagem", {
          description: "O serviço de IA não conseguiu criar a imagem."
        });
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(errorMsg);
      console.error("Erro ao gerar imagem:", e);
      toast.error("Erro na geração de imagem", {
        description: errorMsg
      });
    } finally {
      setLoadingImageIndex(null);
    }
  };
  
  // Função auxiliar para comparar anúncios
  const isMatchingAd = (ad1: MetaAd, ad2: MetaAd) => {
    return ad1.primaryText === ad2.primaryText || 
           ad1.headline === ad2.headline || 
           ad1.imagePrompt === ad2.imagePrompt;
  };
  
  const clearError = () => setError(null);
  
  return {
    handleGenerateImage,
    loadingImageIndex,
    error,
    clearError
  };
};
