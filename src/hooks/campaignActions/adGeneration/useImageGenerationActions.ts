
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
        adContext: ad,
        language: "portuguese", // Forçar idioma português
        model: "dall-e-3" // Especificar modelo explicitamente
      });
      
      if (!imageUrl) {
        throw new Error("A função de geração de imagem não retornou uma URL");
      }
      
      console.log(`✅ Imagem gerada com sucesso para anúncio ${index}:`, imageUrl);
      
      // Atualizar o anúncio com a nova URL da imagem de forma mais segura
      setCampaignData((prev: any) => {
        // Criando cópia profunda para evitar mutações indesejadas
        const newState = JSON.parse(JSON.stringify(prev));
        
        // Verificar se é um anúncio Meta 
        if (prev.metaAds && prev.metaAds.length > index) {
          console.log(`✅ Atualizando URL de imagem em metaAds[${index}]`);
          newState.metaAds[index] = {
            ...newState.metaAds[index],
            imageUrl: imageUrl
          };
        } 
        // Verificar se é um anúncio LinkedIn
        else if (prev.linkedInAds && prev.linkedInAds.length > 0) {
          const linkedInIndex = prev.metaAds ? index - prev.metaAds.length : index;
          if (linkedInIndex >= 0 && linkedInIndex < prev.linkedInAds.length) {
            console.log(`✅ Atualizando URL de imagem em linkedInAds[${linkedInIndex}]`);
            newState.linkedInAds[linkedInIndex] = {
              ...newState.linkedInAds[linkedInIndex],
              imageUrl: imageUrl
            };
          }
        }
        
        console.log("Estado atualizado:", JSON.stringify(newState.metaAds?.[index] || {}, null, 2));
        return newState;
      });
      
      toast.success("Imagem gerada com sucesso", {
        description: "A imagem do anúncio foi criada pela IA."
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(errorMsg);
      console.error(`❌ Erro ao gerar imagem para anúncio ${index}:`, e);
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
