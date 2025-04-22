
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
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
      
      // Ensure the image prompt doesn't include text
      let enhancedPrompt = ad.imagePrompt;
      if (!enhancedPrompt.toLowerCase().includes('sem texto')) {
        enhancedPrompt += " (Sem texto ou palavras na imagem, apenas elementos visuais)";
      }
      
      const imageUrl = await generateAdImage(enhancedPrompt, {
        adType: "instagram",
        adContext: ad,
        language: "portuguese", // Forçar idioma português
        model: "dall-e-3", // Especificar modelo explicitamente
        quality: "hd" // Solicitar alta qualidade
      });
      
      if (!imageUrl) {
        throw new Error("A função de geração de imagem não retornou uma URL");
      }
      
      console.log(`✅ Imagem gerada com sucesso para anúncio ${index}:`, imageUrl);
      
      // Atualizar o anúncio com a nova URL da imagem de forma mais segura
      setCampaignData((prev: any) => {
        // Validar dados para evitar erros
        if (!prev) return prev;
        
        // Criando cópia para evitar mutações indesejadas
        const newState = JSON.parse(JSON.stringify(prev));
        
        // Verificar se é um anúncio Meta 
        if (prev.metaAds && Array.isArray(prev.metaAds) && prev.metaAds.length > index) {
          console.log(`✅ Atualizando URL de imagem em metaAds[${index}]`);
          newState.metaAds[index] = {
            ...newState.metaAds[index],
            imageUrl: imageUrl
          };
          
          console.log(`✅ URL da imagem atualizada para: ${imageUrl.substring(0, 30)}...`);
        } 
        // Verificar se é um anúncio LinkedIn
        else if (prev.linkedInAds && Array.isArray(prev.linkedInAds) && prev.linkedInAds.length > 0) {
          const linkedInIndex = prev.metaAds ? index - prev.metaAds.length : index;
          if (linkedInIndex >= 0 && linkedInIndex < prev.linkedInAds.length) {
            console.log(`✅ Atualizando URL de imagem em linkedInAds[${linkedInIndex}]`);
            newState.linkedInAds[linkedInIndex] = {
              ...newState.linkedInAds[linkedInIndex],
              imageUrl: imageUrl
            };
          }
        }
        
        return newState;
      });
      
      toast.success("Imagem gerada com sucesso", {
        description: "A imagem do anúncio foi criada pela IA."
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(errorMsg);
      console.error(`❌ Erro ao gerar imagem para anúncio ${index}:`, e);
      
      // Oferecer opção de tentar novamente com prompt diferente
      toast.error("Erro na geração de imagem", {
        description: errorMsg,
        action: {
          label: "Tentar novamente",
          onClick: () => handleGenerateImage(ad, index)
        }
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
