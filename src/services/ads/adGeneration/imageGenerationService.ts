
import { supabase } from "@/integrations/supabase/client";

/**
 * Parâmetros de contexto para a geração de imagem.
 */
interface ImageGenerationParams {
  companyName?: string;
  brandTone?: string;
  industry?: string;
  format?: string;
  adContext?: any;
  companyDescription?: string;
  targetAudience?: string;
  objective?: string;
  adType?: string;
  [key: string]: any;
}

/**
 * Utilitário para truncar strings no log.
 * @param str Texto a ser truncado.
 * @param max Tamanho máximo.
 */
const truncate = (str: string, max = 100) =>
  str.length > max ? str.substring(0, max) + "..." : str;

/**
 * Gera uma imagem para anúncio com base em um prompt e contexto adicional.
 * Retorna a URL da imagem gerada ou `null` em caso de erro.
 */
export const generateAdImage = async (
  prompt: string,
  additionalInfo?: ImageGenerationParams
): Promise<string | null> => {
  try {
    if (!prompt || prompt.trim().length < 10) {
      throw new Error("Invalid image prompt: too short or missing");
    }

    const format =
      additionalInfo?.format ||
      (additionalInfo?.adType === "instagram" ? "square" : "landscape");
    const adType = additionalInfo?.adType || "instagram";

    // Prompt enriquecido e contextualizado
    const enhancedPrompt = `
📌 Criação de Imagem para Anúncio ${adType.toUpperCase()}

Marca: ${additionalInfo?.companyName || 'empresa'}
Setor: ${additionalInfo?.industry || 'setor não especificado'}
Público-Alvo: ${additionalInfo?.targetAudience || 'público geral'}
Tom de Voz: ${additionalInfo?.brandTone || 'profissional'}

🎯 Objetivo: ${additionalInfo?.objective || 'conversão'}

🧠 Instruções:
- A imagem deve ser fotorrealista, sem texto.
- Alta qualidade visual, iluminação profissional.
- Fundo limpo e moderno.
- Sem distorções ou marcas d'água.

📥 Prompt do usuário:
${prompt}
`;

    console.log("🖼️ Prompt base (enriquecido):", truncate(enhancedPrompt));

    const requestBody = {
      prompt: enhancedPrompt,
      additionalInfo: {
        ...additionalInfo,
        format,
        adType,
        industry: additionalInfo?.industry || '',
        brandName: additionalInfo?.companyName || '',
        companyDescription: additionalInfo?.companyDescription || '',
        targetAudience: additionalInfo?.targetAudience || '',
        objective: additionalInfo?.objective || ''
      }
    };

    const { data, error } = await supabase.functions.invoke('generate-image-gpt4o', {
      body: requestBody,
    });

    if (error) {
      console.error("🚨 Supabase error:", error);
      throw new Error(error.message || "Erro ao chamar a função de geração de imagem.");
    }

    if (!data?.success || typeof data.imageUrl !== 'string' || !data.imageUrl.startsWith('http')) {
      console.warn("⚠️ Invalid image URL returned:", data?.imageUrl);
      throw new Error(data?.error || "Imagem inválida recebida da IA.");
    }

    console.log("✅ Imagem gerada com sucesso:", data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error("🚨 Erro na geração de imagem:", error);
    return null;
  }
};
