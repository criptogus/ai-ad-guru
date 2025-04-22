
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
  language?: string;
  model?: string;
  [key: string]: any;
}

/**
 * Utilitário para truncar strings no log.
 * @param str Texto a ser truncado.
 * @param max Tamanho máximo.
 */
const truncate = (str: string, max = 100) =>
  str && typeof str === 'string' ? (str.length > max ? str.substring(0, max) + "..." : str) : '[texto inválido]';

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
      console.error("❌ Prompt inválido ou muito curto:", prompt);
      throw new Error("Prompt de imagem inválido: muito curto ou ausente");
    }

    const format = additionalInfo?.format ||
      (additionalInfo?.adType === "instagram" ? "square" : "landscape");
    const adType = additionalInfo?.adType || "instagram";
    const language = additionalInfo?.language || "portuguese"; // Forçar português por padrão

    // Garante que o prompt está em português
    const languagePrompt = language === "portuguese" && !prompt.toLowerCase().includes("português") ? 
      `[GERAR EM PORTUGUÊS] ${prompt}` : prompt;

    // Prompt enriquecido e contextualizado
    const enhancedPrompt = `
📌 Criação de Imagem para Anúncio ${adType.toUpperCase()} EM PORTUGUÊS

Marca: ${additionalInfo?.companyName || 'empresa'}
Setor: ${additionalInfo?.industry || 'setor não especificado'}
Público-Alvo: ${additionalInfo?.targetAudience || 'público geral'}
Tom de Voz: ${additionalInfo?.brandTone || 'profissional'}

🎯 Objetivo: ${additionalInfo?.objective || 'conversão'}

🧠 Instruções:
- A imagem deve ser fotorrealista, sem texto (NO TEXT!) e de alta qualidade.
- Alta qualidade visual, iluminação profissional.
- Fundo limpo e moderno.
- Sem distorções ou marcas d'água.
- IMPORTANTE: CRIAR SOMENTE EM PORTUGUÊS BRASILEIRO!

📥 Prompt do usuário:
${languagePrompt}
`;

    console.log("🖼️ Enviando request para geração de imagem com prompt:", truncate(enhancedPrompt, 150));

    const requestBody = {
      prompt: enhancedPrompt,
      additionalInfo: {
        ...additionalInfo,
        format,
        adType,
        language: "portuguese", // Garantir idioma português
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
      console.error("🚨 Erro na função Supabase:", error);
      throw new Error(error.message || "Erro ao chamar a função de geração de imagem.");
    }

    if (!data?.success || typeof data.imageUrl !== 'string' || !data.imageUrl.startsWith('http')) {
      console.warn("⚠️ URL de imagem inválida retornada:", data?.imageUrl);
      console.warn("Resposta completa:", JSON.stringify(data, null, 2));
      throw new Error(data?.error || "Imagem inválida recebida da IA.");
    }

    console.log("✅ Imagem gerada com sucesso:", truncate(data.imageUrl, 50));
    return data.imageUrl;
  } catch (error) {
    console.error("🚨 Erro na geração de imagem:", error);
    return null;
  }
};
