
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
      console.log(`🖼️ Gerando imagem para anúncio ${index} com prompt:`, ad.imagePrompt);
      
      const imageUrl = await generateAdImage(ad.imagePrompt, {
        adType: "instagram",
        adContext: ad
      });
      
      if (imageUrl) {
        console.log(`✅ Imagem gerada com sucesso para anúncio ${index}:`, imageUrl);
        
        // Atualizar o anúncio com a nova URL da imagem
        setCampaignData((prev: any) => {
          // Verificar qual array de anúncios atualizar
          const newState = { ...prev };
          
          // Verificar se é um anúncio Meta ou LinkedIn
          if (prev.metaAds && prev.metaAds.length > index) {
            newState.metaAds = [...prev.metaAds];
            newState.metaAds[index] = {
              ...newState.metaAds[index],
              imageUrl
            };
            console.log(`✅ URL de imagem atualizada em metaAds[${index}]:`, imageUrl);
          } else if (prev.linkedInAds && prev.linkedInAds.length > 0) {
            const linkedInIndex = prev.metaAds ? index - prev.metaAds.length : index;
            if (linkedInIndex >= 0 && linkedInIndex < prev.linkedInAds.length) {
              newState.linkedInAds = [...prev.linkedInAds];
              newState.linkedInAds[linkedInIndex] = {
                ...newState.linkedInAds[linkedInIndex],
                imageUrl
              };
              console.log(`✅ URL de imagem atualizada em linkedInAds[${linkedInIndex}]:`, imageUrl);
            }
          }
          
          return newState;
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
  
  const clearError = () => setError(null);
  
  return {
    handleGenerateImage,
    loadingImageIndex,
    error,
    clearError
  };
};
