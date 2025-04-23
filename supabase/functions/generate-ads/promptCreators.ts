import { WebsiteAnalysisResult } from "./types.ts";
import { getLanguageFromLocale } from "./utils/languageDetection.ts";

function normalizeLanguage(input: string): string {
  const map: Record<string, string> = {
    "pt": "Português",
    "pt-br": "Português",
    "portuguese": "Português",
    "português": "Português",
    "en": "English",
    "english": "English",
    "es": "Español",
    "español": "Español",
    "spanish": "Español",
  };
  return map[input?.trim().toLowerCase()] || input || "Português";
}

function getLanguageName(langCode: string): string {
  const map: Record<string, string> = {
    pt: "Português",
    en: "Inglês",
    es: "Espanhol",
    fr: "Francês",
    de: "Alemão",
    it: "Italiano",
    zh: "Chinês",
    ja: "Japonês",
    ko: "Coreano"
  };
  return map[langCode.toLowerCase()] || langCode;
}

export function createGoogleAdsPrompt(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): PromptMessages {
  const language = campaignData.language?.toLowerCase() || "en";
  const readableLanguage = getLanguageName(language);

  const systemMessage = `
You are a senior copywriter for high-performance Google Ads campaigns.
Your role is to write ads that generate clicks, using ONLY the data provided below.
Do NOT invent anything. Do NOT mix languages.
Your response must be ENTIRELY in ${readableLanguage.toUpperCase()}.
Avoid generic terms like "professional service" unless they appear explicitly.
Return only the JSON output in the exact format below.
`;

  const userMessage = `
Write 5 Google Ads using the data below:

- Company: ${campaignData.companyName || "(missing)"}
- Website: ${campaignData.websiteUrl || "(missing)"}
- Product or service: ${campaignData.product || "(missing)"}
- Objective: ${campaignData.objective || "(missing)"}
- Target audience: ${campaignData.targetAudience || "(missing)"}
- Tone: ${campaignData.brandTone || "(missing)"}
- Mental trigger: ${mindTrigger || "(missing)"}
- Differentials: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || "(missing)"}
- Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || "(missing)"}
- Description: ${campaignData.companyDescription || campaignData.businessDescription || "(missing)"}

Ad format:
- Each ad must have:
  - 3 headlines (up to 30 characters each)
  - 2 descriptions (up to 90 characters each)
  - A display URL based on the company website

Response format (JSON):
[
  {
    "headline_1": "...",
    "headline_2": "...",
    "headline_3": "...",
    "description_1": "...",
    "description_2": "...",
    "display_url": "www.example.com"
  }
]
`;

  return { systemMessage, userMessage };
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const languageInput = campaignData.language || "Portuguese";
  const language = normalizeLanguage(languageInput);
  const languageCode = getLanguageFromLocale(language);

  const langInstructions = {
    pt: {
      name: "Português",
      generic_terms: "serviços profissionais, resultados de qualidade",
      response_lang: "português"
    },
    es: {
      name: "Español",
      generic_terms: "serviços profesionales, resultados de qualidade",
      response_lang: "español"
    },
    en: {
      name: "English",
      generic_terms: "professional services, quality results",
      response_lang: "English"
    }
  }[languageCode];

  const systemMessage = [
    `Você é um redator publicitário sênior especializado em anúncios para LinkedIn.`,
    `Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.`,
    `A resposta deve estar COMPLETAMENTE em ${langInstructions.name}.`,
    `IMPORTANTE:`,
    `- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.`,
    `- NUNCA use termos genéricos como "${langInstructions.generic_terms}" ou similares.`,
    `- Use APENAS as informações fornecidas abaixo.`,
    `- Ignore campos em branco (NÃO invente dados).`,
    `- Retorne APENAS o JSON formatado conforme o exemplo.`,
    `- Valide que a resposta esteja no formato JSON usando aspas duplas corretas (não use aspas simples) para cada chave e valor.`,
  ].join('\n');

  const userMessage = [
    `Crie 5 anúncios para LinkedIn usando exclusivamente os dados abaixo:`,
    ``,
    `- Empresa: ${campaignData.companyName}`,
    `- Website: ${campaignData.websiteUrl}`,
    `- Produto ou serviço: ${campaignData.product || "Não especificado - não invente"}`,
    `- Objetivo: ${campaignData.objective || "Não especificado - não invente"}`,
    `- Público-alvo: ${campaignData.targetAudience || "Não especificado - não invente"}`,
    `- Tom de voz: ${campaignData.brandTone || "Não especificado - não invente"}`,
    `- Gatilho mental: ${mindTrigger || "Não especificado - não invente"}`,
    `- Diferenciais: ${(Array.isArray(campaignData.uniqueSellingPoints) && campaignData.uniqueSellingPoints.length > 0) ? campaignData.uniqueSellingPoints.join(', ') : "Não especificado - não invente"}`,
    `- Palavras-chave: ${(Array.isArray(campaignData.keywords) && campaignData.keywords.length > 0) ? campaignData.keywords.join(', ') : "Não especificado - não invente"}`,
    `- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || "Não especificado - não invente"}`,
    ``,
    `Requisitos:`,
    `- Cada anúncio deve ter um título atraente`,
    `- Texto principal profissional e persuasivo`,
    `- Descrição complementar`,
    `- Sugestão de imagem (sem texto sobreposto)`,
    `- NÃO incluir texto em inglês ou outro idioma que não seja ${langInstructions.response_lang}`,
    `- NÃO criar dados fictícios ou genéricos`,
    `- O JSON deve ser válido com aspas duplas para todas as chaves e valores.`,
    ``,
    `Formato OBRIGATÓRIO de resposta (JSON):`,
    `[`,
    `  {`,
    `    "headline": "...",`,
    `    "primaryText": "...",`,
    `    "description": "...",`,
    `    "image_prompt": "Foto profissional mostrando..."`,
    `  }`,
    `]`
  ].join('\n');

  return { systemMessage, userMessage };
}

export function createMicrosoftAdsPrompt(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): PromptMessages {
  const language = campaignData.language?.toLowerCase() || "en";
  const readableLanguage = getLanguageName(language);

  const systemMessage = `
You are a Bing Ads expert. Write search ads optimized for conversions, using ONLY the campaign data provided.
Do NOT invent any data. Use the language: ${readableLanguage.toUpperCase()} only.
Be direct, persuasive, and informative.
NEVER mix languages or use placeholder terms.
Return ONLY the ads in the JSON format shown below.
`;

  const userMessage = `
Create 5 Bing Ads for Microsoft Advertising:

- Company: ${campaignData.companyName || "(missing)"}
- Website: ${campaignData.websiteUrl || "(missing)"}
- Product or service: ${campaignData.product || "(missing)"}
- Objective: ${campaignData.objective || "(missing)"}
- Target audience: ${campaignData.targetAudience || "(missing)"}
- Tone: ${campaignData.brandTone || "(missing)"}
- Mental trigger: ${mindTrigger || "(missing)"}
- Differentials: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || "(missing)"}
- Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || "(missing)"}
- Description: ${campaignData.companyDescription || campaignData.businessDescription || "(missing)"}

Format:
- 3 headlines (30 characters max)
- 2 descriptions (90 characters max)
- Display URL must be based on the provided website

JSON Format:
[
  {
    "headline_1": "...",
    "headline_2": "...",
    "headline_3": "...",
    "description_1": "...",
    "description_2": "...",
    "display_url": "www.example.com"
  }
]
`;

  return { systemMessage, userMessage };
}

export function createMetaAdsPrompt(
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): PromptMessages {
  const language = (campaignData.language || "pt")
    .trim().toLowerCase();
  const readableLanguage = getLanguageName(language);

  const systemMessage = `
You are a senior copywriter specialized in Meta/Instagram ads.
Your job is to write highly effective, CONVERTING Meta/Instagram ads using ONLY the provided information.

STRICT LANGUAGE GUIDELINES:
- ABSOLUTELY NO mixing of languages: Use ONLY ${readableLanguage.toUpperCase()}, never combine with English or any other language.
- You MUST write 100% in ${readableLanguage.toUpperCase()} as detected from the website.
- If the language is Portuguese (pt or pt-br), write ONLY in formal Brazilian Portuguese.
- Do NOT use English, Spanglish, or any translation; the full ad must be in ${readableLanguage.toUpperCase()}.
- Never use generic placeholders or create assumptions about missing info!

PUNCTUATION/FORMATTING:
- All sentences must start with capital letters and end with proper punctuation (period, exclamation, or question mark), NO truncation.
- Never cut sentences: output must be fluid, logical, and proof-read for human quality.
- Do NOT invent content or include any text not provided.

OUTPUT FORMAT: return ONLY valid JSON as specified.
`;

  const userMessage = `
Based ONLY on these details, create 5 Meta/Instagram ad variations:

- Company: ${campaignData.companyName || "(missing)"}
- Website: ${campaignData.websiteUrl || "(missing)"}
- Product/Service: ${campaignData.product || "(missing)"}
- Objective: ${campaignData.objective || "(missing)"}
- Target Audience: ${campaignData.targetAudience || "(missing)"}
- Tone of Voice: ${campaignData.brandTone || "(missing)"}
- Mental Trigger: ${mindTrigger || "(missing)"}
- Differentials: ${Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || "(missing)"}
- Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || "(missing)"}
- Description: ${campaignData.companyDescription || campaignData.businessDescription || "(missing)"}

For EACH ad, you must provide:
- "headline": a concise, original headline (max 1 sentence, correct punctuation)
- "primaryText": a persuasive, emotional main text (Instagram caption style, full sentences, proof-read, correct punctuation)
- "description": a short support description (proper sentence, punctuation)
- "image_prompt": a detailed image description (min. 20 words), no text or logos in the image, ONLY visual content, specify target audience/setting/lighting as relevant (FEED/STORY format)

RETURN ONLY this JSON, do not explain or comment:
[
  {
    "headline": "...",
    "primaryText": "...",
    "description": "...",
    "image_prompt": "..."
  }
]
`;

  return { systemMessage, userMessage };
}
