
import { useState } from 'react';
import { useCredits } from '@/contexts/CreditsContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useImageGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deductCredits } = useCredits();

  const generateAdImage = async (prompt: string, additionalInfo?: any): Promise<string | null> => {
    if (!prompt) {
      setError("Descrição da imagem é necessária");
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      console.log("Gerando imagem com prompt:", prompt);
      console.log("Informações adicionais:", additionalInfo);
      
      // Prepare the prompt with Portuguese language guarantee
      let enhancedPrompt = prompt;
      
      // Add language context if not specified
      if (!prompt.toLowerCase().includes('português') && 
          !prompt.toLowerCase().includes('brazilian')) {
        enhancedPrompt = `Imagem profissional para anúncio em português: ${prompt}`;
      }
      
      // Add brand context if available
      if (additionalInfo?.brandName || additionalInfo?.companyName) {
        const brandName = additionalInfo.brandName || additionalInfo.companyName;
        enhancedPrompt += ` Marca: ${brandName}.`;
      }
      
      // Add industry context if available
      if (additionalInfo?.industry) {
        enhancedPrompt += ` Indústria: ${additionalInfo.industry}.`;
      }
      
      // Determine format based on platform and format
      const platform = additionalInfo?.platform || 'instagram';
      const imageFormat = additionalInfo?.imageFormat || additionalInfo?.format || 'square';
      
      // Call the Supabase Edge Function for image generation
      const { data, error: functionError } = await supabase.functions.invoke('generate-meta-ad-image', {
        body: {
          prompt: enhancedPrompt,
          format: imageFormat,
          userId: additionalInfo?.userId,
          language: 'portuguese' // Force Portuguese language
        }
      });
      
      if (functionError) {
        console.error("Erro na função de geração de imagem:", functionError);
        throw new Error(functionError.message);
      }
      
      if (!data?.success || !data?.imageUrl) {
        throw new Error(data?.error || "Falha ao gerar imagem");
      }
      
      // Apply credit deduction if available
      if (deductCredits) {
        // Standard cost for image generation is 5 credits
        deductCredits(5);
        toast.success("Imagem Gerada", {
          description: "5 créditos utilizados para geração de imagem com IA"
        });
      }
      
      console.log("URL da imagem gerada:", data.imageUrl);
      return data.imageUrl;
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ocorrido";
      setError(errorMessage);
      
      toast.error("Falha ao gerar imagem", {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateAdImage,
    isGenerating,
    error
  };
};
