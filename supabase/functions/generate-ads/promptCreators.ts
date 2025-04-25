
import { WebsiteAnalysisResult } from "./types.ts";
import { getLanguageFromLocale } from "./utils/languageDetection.ts";

type PromptMessages = {
  systemMessage: string;
  userMessage: string;
};

// Helper to normalize language references
function getLanguageName(langCode: string): string {
  const map: Record<string, string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
    fr: "Français",
    de: "Allemand",
    it: "Italiano"
  };
  return map[langCode.toLowerCase()] || "Português";
}

// Google Ads prompt creator with consistent Portuguese language enforcement
export function createGoogleAdsPrompt(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): PromptMessages {
  const systemMessage = `
Você é um especialista em redação publicitária para anúncios Google Ads.
IMPORTANTE: Responda APENAS em português do Brasil. Não use NENHUMA palavra em inglês.
Seu papel é escrever anúncios que geram cliques, usando APENAS os dados fornecidos abaixo.
NUNCA invente nada. NUNCA misture idiomas. Sua resposta deve ser 100% em português brasileiro.
Evite termos genéricos como "serviço profissional" a menos que apareçam explicitamente.
Retorne apenas o JSON de saída no formato exato abaixo.
`;

  const userMessage = `
Escreva 5 anúncios Google Ads usando os dados abaixo:

- Empresa: ${campaignData.companyName || "(não fornecido)"}
- Website: ${campaignData.websiteUrl || "(não fornecido)"}
- Produto ou serviço: ${campaignData.product || "(não fornecido)"}
- Objetivo: ${campaignData.objective || "(não fornecido)"}
- Público-alvo: ${campaignData.targetAudience || "(não fornecido)"}
- Tom: ${campaignData.brandTone || "(não fornecido)"}
- Gatilho mental: ${mindTrigger || "(não fornecido)"}
- Diferenciais: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || "(não fornecido)"}
- Palavras-chave: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || "(não fornecido)"}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || "(não fornecido)"}

Formato do anúncio:
- Cada anúncio deve ter:
  - 3 títulos (até 30 caracteres cada)
  - 2 descrições (até 90 caracteres cada)
  - Um URL de exibição baseado no website da empresa

Formato da resposta (JSON):
{
  "ads": [
    {
      "headline_1": "...",
      "headline_2": "...",
      "headline_3": "...",
      "description_1": "...",
      "description_2": "...",
      "display_url": "www.exemplo.com.br"
    }
  ]
}

IMPORTANTE: Anúncios DEVEM estar em português do Brasil. NÃO use palavras em inglês.
`;

  console.log("📝 Google Ads System Message:", systemMessage);
  console.log("📝 Google Ads User Message:", userMessage);

  return { systemMessage, userMessage };
}

// LinkedIn Ads prompt creator with consistent Portuguese language enforcement
export function createLinkedInAdsPrompt(
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string
): PromptMessages {
  const systemMessage = `
Você é um redator publicitário sênior especializado em anúncios para LinkedIn.
Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.
IMPORTANTE: Responda APENAS em português do Brasil. Não use NENHUMA palavra em inglês.
A resposta deve estar COMPLETAMENTE em português brasileiro.
IMPORTANTE:
- JAMAIS misture idiomas, seja 100% fiel ao português brasileiro.
- NUNCA use termos genéricos como "serviços profissionais" ou similares.
- Use APENAS as informações fornecidas abaixo.
- Ignore campos em branco (NÃO invente dados).
- Retorne APENAS o JSON formatado conforme o exemplo.
- Valide que a resposta esteja no formato JSON usando aspas duplas corretas (não use aspas simples) para cada chave e valor.
`;

  const userMessage = `
Crie 5 anúncios para LinkedIn usando exclusivamente os dados abaixo:

- Empresa: ${campaignData.companyName}
- Website: ${campaignData.websiteUrl}
- Produto ou serviço: ${campaignData.product || "Não especificado - não invente"}
- Objetivo: ${campaignData.objective || "Não especificado - não invente"}
- Público-alvo: ${campaignData.targetAudience || "Não especificado - não invente"}
- Tom de voz: ${campaignData.brandTone || "Não especificado - não invente"}
- Gatilho mental: ${mindTrigger || "Não especificado - não invente"}
- Diferenciais: ${(Array.isArray(campaignData.uniqueSellingPoints) && campaignData.uniqueSellingPoints.length > 0) ? campaignData.uniqueSellingPoints.join(', ') : "Não especificado - não invente"}
- Palavras-chave: ${(Array.isArray(campaignData.keywords) && campaignData.keywords.length > 0) ? campaignData.keywords.join(', ') : "Não especificado - não invente"}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || "Não especificado - não invente"}

Requisitos:
- Cada anúncio deve ter um título atraente
- Texto principal profissional e persuasivo
- Descrição complementar
- Sugestão de imagem (sem texto sobreposto)
- NÃO incluir texto em inglês ou outro idioma que não seja português brasileiro
- NÃO criar dados fictícios ou genéricos
- O JSON deve ser válido com aspas duplas para todas as chaves e valores.

Formato OBRIGATÓRIO de resposta (JSON):
{
  "ads": [
    {
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "image_prompt": "Foto profissional mostrando..."
    }
  ]
}

IMPORTANTE: Anúncios DEVEM estar em português do Brasil. NÃO use palavras em inglês.
`;

  console.log("📝 LinkedIn Ads System Message:", systemMessage);
  console.log("📝 LinkedIn Ads User Message:", userMessage);

  return { systemMessage, userMessage };
}

// Microsoft Ads prompt creator with consistent Portuguese language enforcement
export function createMicrosoftAdsPrompt(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): PromptMessages {
  const systemMessage = `
Você é um especialista em anúncios Microsoft/Bing. Escreva anúncios de pesquisa otimizados para conversões, usando APENAS os dados de campanha fornecidos.
IMPORTANTE: Responda APENAS em português do Brasil. Não use NENHUMA palavra em inglês.
NÃO invente nenhum dado. Use apenas o idioma português brasileiro.
Seja direto, persuasivo e informativo.
NUNCA misture idiomas ou use termos genéricos.
Retorne APENAS os anúncios no formato JSON mostrado abaixo.
`;

  const userMessage = `
Crie 5 anúncios Bing para Microsoft Advertising:

- Empresa: ${campaignData.companyName || "(não fornecido)"}
- Website: ${campaignData.websiteUrl || "(não fornecido)"}
- Produto ou serviço: ${campaignData.product || "(não fornecido)"}
- Objetivo: ${campaignData.objective || "(não fornecido)"}
- Público-alvo: ${campaignData.targetAudience || "(não fornecido)"}
- Tom: ${campaignData.brandTone || "(não fornecido)"}
- Gatilho mental: ${mindTrigger || "(não fornecido)"}
- Diferenciais: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || "(não fornecido)"}
- Palavras-chave: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || "(não fornecido)"}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || "(não fornecido)"}

Formato:
- 3 títulos (máximo 30 caracteres)
- 2 descrições (máximo 90 caracteres)
- URL de exibição deve ser baseado no website fornecido

Formato JSON:
{
  "ads": [
    {
      "headline_1": "...",
      "headline_2": "...",
      "headline_3": "...",
      "description_1": "...",
      "description_2": "...",
      "display_url": "www.exemplo.com.br"
    }
  ]
}

IMPORTANTE: Anúncios DEVEM estar em português do Brasil. NÃO use palavras em inglês.
`;

  console.log("📝 Microsoft Ads System Message:", systemMessage);
  console.log("📝 Microsoft Ads User Message:", userMessage);

  return { systemMessage, userMessage };
}

// Meta Ads prompt creator with consistent Portuguese language enforcement
export function createMetaAdsPrompt(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): PromptMessages {
  const systemMessage = `
Você é um redator publicitário especializado em anúncios Meta/Instagram.
Sua função é escrever anúncios altamente eficazes e CONVERSIVOS usando APENAS as informações fornecidas.

DIRETRIZES ESTRITAS DE IDIOMA:
- ABSOLUTAMENTE SEM mistura de idiomas: Use APENAS PORTUGUÊS BRASILEIRO, nunca combine com inglês ou qualquer outro idioma.
- Você DEVE escrever 100% em PORTUGUÊS BRASILEIRO.
- Se o idioma é português (pt ou pt-br), escreva APENAS em português brasileiro formal.
- NUNCA use inglês, spanglish ou qualquer tradução; o anúncio completo deve estar em PORTUGUÊS BRASILEIRO.
- Nunca use espaços reservados genéricos ou crie suposições sobre informações ausentes!

PONTUAÇÃO/FORMATAÇÃO:
- Todas as frases devem começar com letras maiúsculas e terminar com pontuação adequada (ponto, exclamação ou interrogação), SEM truncamento.
- Nunca corte frases: a saída deve ser fluida, lógica e revisada com qualidade humana.
- NÃO invente conteúdo ou inclua qualquer texto não fornecido.

FORMATO DE SAÍDA: retorne APENAS JSON válido conforme especificado.
`;

  const userMessage = `
Com base APENAS nestes detalhes, crie 5 variações de anúncios Meta/Instagram:

- Empresa: ${campaignData.companyName || "(não fornecido)"}
- Website: ${campaignData.websiteUrl || "(não fornecido)"}
- Produto/Serviço: ${campaignData.product || "(não fornecido)"}
- Objetivo: ${campaignData.objective || "(não fornecido)"}
- Público-alvo: ${campaignData.targetAudience || "(não fornecido)"}
- Tom de voz: ${campaignData.brandTone || "(não fornecido)"}
- Gatilho mental: ${mindTrigger || "(não fornecido)"}
- Diferenciais: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || "(não fornecido)"}
- Palavras-chave: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || "(não fornecido)"}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || "(não fornecido)"}

Para CADA anúncio, você deve fornecer:
- "headline": um título conciso e original (máx. 1 frase, pontuação correta)
- "primaryText": um texto principal persuasivo e emocional (estilo legenda do Instagram, frases completas, revisado, pontuação correta)
- "description": uma breve descrição de apoio (frase adequada, pontuação)
- "image_prompt": uma descrição detalhada da imagem (mín. 20 palavras), sem texto ou logotipos na imagem, APENAS conteúdo visual, específico para Instagram/Facebook

Formato JSON (OBRIGATÓRIO):
{
  "ads": [
    {
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "image_prompt": "..."
    }
  ]
}

IMPORTANTE: Anúncios DEVEM estar em português do Brasil. NÃO use palavras em inglês.
`;

  console.log("📝 Meta Ads System Message:", systemMessage);
  console.log("📝 Meta Ads User Message:", userMessage);

  return { systemMessage, userMessage };
}
