
import { createGoogleAdsPrompt, createMetaAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt } from "./promptCreators.ts";
import { WebsiteAnalysisResult } from "./types.ts";
import { validateGoogleAdsResponse, validateSocialAdsResponse, getSimplifiedLanguageCode } from "./responseValidators.ts";
import { generateFallbackGoogleAds, generateFallbackMetaAds, generateFallbackLinkedInAds, generateFallbackMicrosoftAds } from "./fallbacks/index.ts";

// Configuração do cliente OpenAI
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Função para chamar a API do OpenAI
async function callOpenAI(prompt: { systemMessage: string; userMessage: string }, temperature: number = 0.7) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required but not set in environment");
  }

  const apiUrl = "https://api.openai.com/v1/chat/completions";
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Usando GPT-4o para melhor qualidade e suporte ao response_format
        messages: [
          { role: "system", content: prompt.systemMessage },
          { role: "user", content: prompt.userMessage }
        ],
        temperature: temperature,
        max_tokens: 1200,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error calling OpenAI API:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      console.error("❌ Não foi possível fazer parse da resposta JSON:", content);
      console.error("Erro:", e);
      throw new Error("A resposta do OpenAI não está em formato JSON válido. Verifique o prompt ou tente novamente.");
    }
  } catch (error) {
    console.error("Error in OpenAI request:", error);
    throw error;
  }
}

/**
 * Função para gerar anúncios do Google com base na análise do website
 */
export async function generateGoogleAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string) {
  try {
    console.log("Gerando anúncios para o Google Ads...");
    
    // Validar dados mínimos necessários
    if (!campaignData.companyName) {
      throw new Error("O nome da empresa é obrigatório para gerar anúncios");
    }
    
    // Criação do prompt
    const prompt = createGoogleAdsPrompt(campaignData, mindTrigger);
    console.log("Prompt do sistema criado para Google Ads");
    
    // Chamada à API do OpenAI
    try {
      const adsResponse = await callOpenAI(prompt, 0.5);
      
      // Validar a resposta
      let ads = Array.isArray(adsResponse) ? adsResponse : [];
      
      // Se a resposta for um objeto com uma propriedade Array, tentar extrair
      if (!Array.isArray(adsResponse) && typeof adsResponse === 'object') {
        const possibleArrayKeys = Object.keys(adsResponse).filter(key => 
          Array.isArray(adsResponse[key]) && 
          adsResponse[key].length > 0 &&
          (key.includes('ad') || key.includes('google') || key.includes('result'))
        );
        
        if (possibleArrayKeys.length > 0) {
          ads = adsResponse[possibleArrayKeys[0]];
          console.log(`Extraído anúncios da propriedade: ${possibleArrayKeys[0]}`);
        }
      }
      
      if (!ads || ads.length === 0) {
        console.log("⚠️ Nenhum anúncio válido retornado pelo OpenAI, usando fallbacks");
        return generateFallbackGoogleAds(campaignData);
      }
      
      // Validar e substituir termos genéricos
      const langCode = getSimplifiedLanguageCode(campaignData.language || 'pt');
      const validatedAds = validateGoogleAdsResponse(ads, langCode, campaignData);
      
      // Substituir anúncios com termos genéricos por fallbacks
      const finalAds = [];
      const fallbackAds = generateFallbackGoogleAds(campaignData);
      let fallbackIndex = 0;
      
      for (const ad of validatedAds) {
        if (ad._containsGenericTerms) {
          // Usar um anúncio fallback
          if (fallbackIndex < fallbackAds.length) {
            finalAds.push(fallbackAds[fallbackIndex]);
            fallbackIndex++;
          }
        } else {
          // Manter o anúncio original em formato padronizado
          finalAds.push({
            headline1: ad.headline_1 || ad.headline1 || '',
            headline2: ad.headline_2 || ad.headline2 || '',
            headline3: ad.headline_3 || ad.headline3 || '',
            description1: ad.description_1 || ad.description1 || '',
            description2: ad.description_2 || ad.description2 || '',
            displayPath: ad.display_url || ad.displayPath || ad.displayUrl || campaignData.websiteUrl,
            path1: ad.path1 || '',
            path2: ad.path2 || ''
          });
        }
      }
      
      // Garantir que temos pelo menos 3 anúncios
      while (finalAds.length < 3 && fallbackIndex < fallbackAds.length) {
        finalAds.push(fallbackAds[fallbackIndex]);
        fallbackIndex++;
      }
      
      return finalAds;
    } catch (openAIError) {
      console.error("Erro ao chamar OpenAI:", openAIError);
      // Em caso de erro na API, usar fallbacks
      return generateFallbackGoogleAds(campaignData);
    }
  } catch (error) {
    console.error("Erro ao gerar anúncios do Google:", error);
    // Em caso de erro geral, usar fallbacks
    return generateFallbackGoogleAds(campaignData);
  }
}

/**
 * Função para gerar anúncios do Instagram/Meta com base na análise do website
 */
export async function generateMetaAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string) {
  try {
    console.log("Gerando anúncios para o Meta/Instagram...");
    
    // Validar dados mínimos necessários
    if (!campaignData.companyName) {
      throw new Error("O nome da empresa é obrigatório para gerar anúncios");
    }
    
    // Criação do prompt
    const prompt = createMetaAdsPrompt(campaignData, mindTrigger);
    console.log("Prompt do sistema criado para Meta Ads");
    
    // Chamada à API do OpenAI
    try {
      const adsResponse = await callOpenAI(prompt, 0.6);
      
      // Validar a resposta
      let ads = Array.isArray(adsResponse) ? adsResponse : [];
      
      // Se a resposta for um objeto com uma propriedade Array, tentar extrair
      if (!Array.isArray(adsResponse) && typeof adsResponse === 'object') {
        const possibleArrayKeys = Object.keys(adsResponse).filter(key => 
          Array.isArray(adsResponse[key]) && 
          adsResponse[key].length > 0 &&
          (key.includes('ad') || key.includes('meta') || key.includes('instagram') || key.includes('result'))
        );
        
        if (possibleArrayKeys.length > 0) {
          ads = adsResponse[possibleArrayKeys[0]];
          console.log(`Extraído anúncios da propriedade: ${possibleArrayKeys[0]}`);
        }
      }
      
      if (!ads || ads.length === 0) {
        console.log("⚠️ Nenhum anúncio válido retornado pelo OpenAI, usando fallbacks");
        return generateFallbackMetaAds(campaignData);
      }
      
      // Validar e substituir termos genéricos
      const langCode = getSimplifiedLanguageCode(campaignData.language || 'pt');
      const validatedAds = validateSocialAdsResponse(ads, langCode, campaignData);
      
      // Substituir anúncios com termos genéricos por fallbacks
      const finalAds = [];
      const fallbackAds = generateFallbackMetaAds(campaignData);
      let fallbackIndex = 0;
      
      for (const ad of validatedAds) {
        if (ad._containsGenericTerms) {
          // Usar um anúncio fallback
          if (fallbackIndex < fallbackAds.length) {
            finalAds.push(fallbackAds[fallbackIndex]);
            fallbackIndex++;
          }
        } else {
          // Manter o anúncio original em formato padronizado
          finalAds.push({
            headline: ad.headline || '',
            primaryText: ad.primaryText || ad.text || '',
            description: ad.description || '',
            imagePrompt: ad.image_prompt || ad.imagePrompt || '',
            format: ad.format || 'feed'
          });
        }
      }
      
      // Garantir que temos pelo menos 3 anúncios
      while (finalAds.length < 3 && fallbackIndex < fallbackAds.length) {
        finalAds.push(fallbackAds[fallbackIndex]);
        fallbackIndex++;
      }
      
      return finalAds;
    } catch (openAIError) {
      console.error("Erro ao chamar OpenAI:", openAIError);
      // Em caso de erro na API, usar fallbacks
      return generateFallbackMetaAds(campaignData);
    }
  } catch (error) {
    console.error("Erro ao gerar anúncios do Meta/Instagram:", error);
    // Em caso de erro geral, usar fallbacks
    return generateFallbackMetaAds(campaignData);
  }
}

/**
 * Função para gerar anúncios do LinkedIn com base na análise do website
 */
export async function generateLinkedInAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string) {
  try {
    console.log("Gerando anúncios para o LinkedIn...");
    
    // Validar dados mínimos necessários
    if (!campaignData.companyName) {
      throw new Error("O nome da empresa é obrigatório para gerar anúncios");
    }
    
    // Criação do prompt
    const prompt = createLinkedInAdsPrompt(campaignData, mindTrigger);
    console.log("Prompt do sistema criado para LinkedIn Ads");
    
    // Chamada à API do OpenAI
    try {
      const adsResponse = await callOpenAI(prompt, 0.6);
      
      // Validar a resposta
      let ads = Array.isArray(adsResponse) ? adsResponse : [];
      
      // Se a resposta for um objeto com uma propriedade Array, tentar extrair
      if (!Array.isArray(adsResponse) && typeof adsResponse === 'object') {
        const possibleArrayKeys = Object.keys(adsResponse).filter(key => 
          Array.isArray(adsResponse[key]) && 
          adsResponse[key].length > 0 &&
          (key.includes('ad') || key.includes('linkedin') || key.includes('result'))
        );
        
        if (possibleArrayKeys.length > 0) {
          ads = adsResponse[possibleArrayKeys[0]];
          console.log(`Extraído anúncios da propriedade: ${possibleArrayKeys[0]}`);
        }
      }
      
      if (!ads || ads.length === 0) {
        console.log("⚠️ Nenhum anúncio válido retornado pelo OpenAI, usando fallbacks");
        return generateFallbackLinkedInAds(campaignData);
      }
      
      // Validar e substituir termos genéricos
      const langCode = getSimplifiedLanguageCode(campaignData.language || 'pt');
      const validatedAds = validateSocialAdsResponse(ads, langCode, campaignData);
      
      // Substituir anúncios com termos genéricos por fallbacks
      const finalAds = [];
      const fallbackAds = generateFallbackLinkedInAds(campaignData);
      let fallbackIndex = 0;
      
      for (const ad of validatedAds) {
        if (ad._containsGenericTerms) {
          // Usar um anúncio fallback
          if (fallbackIndex < fallbackAds.length) {
            finalAds.push(fallbackAds[fallbackIndex]);
            fallbackIndex++;
          }
        } else {
          // Manter o anúncio original em formato padronizado
          finalAds.push({
            headline: ad.headline || '',
            primaryText: ad.primaryText || ad.text || '',
            description: ad.description || '',
            imagePrompt: ad.image_prompt || ad.imagePrompt || '',
            format: ad.format || 'single-image'
          });
        }
      }
      
      // Garantir que temos pelo menos 3 anúncios
      while (finalAds.length < 3 && fallbackIndex < fallbackAds.length) {
        finalAds.push(fallbackAds[fallbackIndex]);
        fallbackIndex++;
      }
      
      return finalAds;
    } catch (openAIError) {
      console.error("Erro ao chamar OpenAI:", openAIError);
      // Em caso de erro na API, usar fallbacks
      return generateFallbackLinkedInAds(campaignData);
    }
  } catch (error) {
    console.error("Erro ao gerar anúncios do LinkedIn:", error);
    // Em caso de erro geral, usar fallbacks
    return generateFallbackLinkedInAds(campaignData);
  }
}

/**
 * Função para gerar anúncios do Microsoft/Bing com base na análise do website
 */
export async function generateMicrosoftAds(campaignData: WebsiteAnalysisResult, mindTrigger?: string) {
  try {
    console.log("Gerando anúncios para o Microsoft/Bing...");
    
    // Validar dados mínimos necessários
    if (!campaignData.companyName) {
      throw new Error("O nome da empresa é obrigatório para gerar anúncios");
    }
    
    // Criação do prompt
    const prompt = createMicrosoftAdsPrompt(campaignData, mindTrigger);
    console.log("Prompt do sistema criado para Microsoft Ads");
    
    // Chamada à API do OpenAI
    try {
      const adsResponse = await callOpenAI(prompt, 0.5);
      
      // Validar a resposta
      let ads = Array.isArray(adsResponse) ? adsResponse : [];
      
      // Se a resposta for um objeto com uma propriedade Array, tentar extrair
      if (!Array.isArray(adsResponse) && typeof adsResponse === 'object') {
        const possibleArrayKeys = Object.keys(adsResponse).filter(key => 
          Array.isArray(adsResponse[key]) && 
          adsResponse[key].length > 0 &&
          (key.includes('ad') || key.includes('microsoft') || key.includes('bing') || key.includes('result'))
        );
        
        if (possibleArrayKeys.length > 0) {
          ads = adsResponse[possibleArrayKeys[0]];
          console.log(`Extraído anúncios da propriedade: ${possibleArrayKeys[0]}`);
        }
      }
      
      if (!ads || ads.length === 0) {
        console.log("⚠️ Nenhum anúncio válido retornado pelo OpenAI, usando fallbacks");
        return generateFallbackMicrosoftAds(campaignData);
      }
      
      // Validar e substituir termos genéricos
      const langCode = getSimplifiedLanguageCode(campaignData.language || 'pt');
      const validatedAds = validateGoogleAdsResponse(ads, langCode, campaignData);
      
      // Substituir anúncios com termos genéricos por fallbacks
      const finalAds = [];
      const fallbackAds = generateFallbackMicrosoftAds(campaignData);
      let fallbackIndex = 0;
      
      for (const ad of validatedAds) {
        if (ad._containsGenericTerms) {
          // Usar um anúncio fallback
          if (fallbackIndex < fallbackAds.length) {
            finalAds.push(fallbackAds[fallbackIndex]);
            fallbackIndex++;
          }
        } else {
          // Manter o anúncio original em formato padronizado
          finalAds.push({
            headline1: ad.headline_1 || ad.headline1 || '',
            headline2: ad.headline_2 || ad.headline2 || '',
            headline3: ad.headline_3 || ad.headline3 || '',
            description1: ad.description_1 || ad.description1 || '',
            description2: ad.description_2 || ad.description2 || '',
            displayPath: ad.display_url || ad.displayPath || ad.displayUrl || campaignData.websiteUrl,
            path1: ad.path1 || '',
            path2: ad.path2 || ''
          });
        }
      }
      
      // Garantir que temos pelo menos 3 anúncios
      while (finalAds.length < 3 && fallbackIndex < fallbackAds.length) {
        finalAds.push(fallbackAds[fallbackIndex]);
        fallbackIndex++;
      }
      
      return finalAds;
    } catch (openAIError) {
      console.error("Erro ao chamar OpenAI:", openAIError);
      // Em caso de erro na API, usar fallbacks
      return generateFallbackMicrosoftAds(campaignData);
    }
  } catch (error) {
    console.error("Erro ao gerar anúncios do Microsoft/Bing:", error);
    // Em caso de erro geral, usar fallbacks
    return generateFallbackMicrosoftAds(campaignData);
  }
}
