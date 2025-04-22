
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

    // Ensure format is properly set based on additionalInfo
    const format = additionalInfo?.format ||
      (additionalInfo?.adType === "instagram" ? "square" : "landscape");
    const adType = additionalInfo?.adType || "instagram";
    const language = "português"; // Forçar português SEMPRE
    
    // Add Brazilian context keywords if not present 
    let promptText = prompt;
    if (!promptText.toLowerCase().includes("brasil") && 
        !promptText.toLowerCase().includes("brasileir")) {
      promptText += ", estética brasileira, estilo brasileiro";
    }
    
    // Force Portuguese and prevent text
    const enhancedPrompt = `
📌 Criação de Imagem para Anúncio ${adType.toUpperCase()} EM PORTUGUÊS DO BRASIL

Marca: ${additionalInfo?.companyName || 'empresa'}
Setor: ${additionalInfo?.industry || 'setor não especificado'}
Público-Alvo: ${additionalInfo?.targetAudience || 'público geral'}
Tom de Voz: ${additionalInfo?.brandTone || 'profissional'}

🎯 Objetivo: ${additionalInfo?.objective || 'conversão'}

🧠 Instruções MANDATÓRIAS:
- A imagem deve ser FOTORREALISTA, de ALTA QUALIDADE e PROFISSIONAL. *SEM TEXTO VISÍVEL*
- ABSOLUTAMENTE NENHUM TEXTO na imagem - Nenhuma palavra, frase ou letra.
- ZERO distorções nas faces ou corpos humanos.
- Ambiente brasileiro, público brasileiro.
- Iluminação profissional de estúdio.
- Fundo limpo e moderno.
- Cores vivas e atraentes.
- SEM marcas d'água ou artefatos.
- IMPORTANTE: Criar imagem que funcionaria em ANÚNCIO REAL do Instagram.

📥 Prompt para Imagem:
${promptText}

⚠️ LEMBRETE FINAL: Não incluir nenhum texto, palavra ou letra na imagem. A imagem deve ser completamente livre de qualquer texto.
`;

    console.log("🖼️ Enviando requisição para geração de imagem DALL-E 3:");
    console.log(truncate(enhancedPrompt, 200));

    const requestBody = {
      prompt: enhancedPrompt,
      additionalInfo: {
        ...additionalInfo,
        format,
        adType,
        language: "portuguese", // Garantir idioma português
        model: "dall-e-3",
        quality: "hd",
        industry: additionalInfo?.industry || '',
        brandName: additionalInfo?.companyName || '',
        companyDescription: additionalInfo?.companyDescription || '',
        targetAudience: additionalInfo?.targetAudience || '',
        objective: additionalInfo?.objective || ''
      }
    };

    // Make three attempts to generate if needed
    let attempts = 0;
    let maxAttempts = 2;
    let data;
    let error;
    
    while (attempts <= maxAttempts) {
      attempts++;
      console.log(`🔄 Tentativa ${attempts} de gerar imagem com DALL-E 3`);
      
      try {
        const response = await supabase.functions.invoke('generate-image-gpt4o', {
          body: requestBody,
        });
        
        data = response.data;
        error = response.error;
        
        if (!error && data?.success && data?.imageUrl) {
          break; // Successfully got an image, exit the loop
        } else {
          console.warn(`⚠️ Tentativa ${attempts} falhou:`, error || "Resposta inválida");
          
          // Small delay before retry
          if (attempts <= maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        }
      } catch (attemptError) {
        console.error(`❌ Erro na tentativa ${attempts}:`, attemptError);
      }
    }
    
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
