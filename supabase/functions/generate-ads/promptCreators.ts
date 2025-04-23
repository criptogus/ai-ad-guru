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

interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
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
      generic_terms: "servicios profesionales, resultados de qualidade",
      response_lang: "español"
    },
    en: {
      name: "English",
      generic_terms: "professional services, quality results",
      response_lang: "English"
    }
  }[languageCode];

  const systemMessage = [
    `Você é um redator publicitário sênior especializado em anúncios de Google Ads.`,
    `Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.`,
    `A resposta deve estar COMPLETAMENTE em ${langInstructions.name}.`,
    `IMPORTANTE:`,
    `- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.`,
    `- NUNCA use termos genéricos como "${langInstructions.generic_terms}" ou similares.`,
    `- Use APENAS as informações fornecidas abaixo.`,
    `- Ignore campos em branco (NÃO invente dados).`,
    `- Retorne APENAS o JSON formatado conforme o exemplo.`,
    `- Valide que a resposta esteja no formato JSON usando aspas duplas corretas (não use aspas simples) para cada chave e valor.`,
    `- NÃO use pontuação incorreta, como pontos no meio de frases ou após vírgulas.`,
    `- Cada título e descrição deve ter pontuação correta e ser uma frase coerente.`,
    `- Evite repetir as mesmas informações em diferentes títulos.`,
  ].join('\n');

  const userMessage = [
    `Crie 5 anúncios de texto para Google Ads usando exclusivamente os dados abaixo:`,
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
    `- Cada anúncio deve ter 3 títulos (máx 30 caracteres cada)`,
    `- 2 descrições (máx 90 caracteres cada)`,
    `- Um display_url baseado no site fornecido`,
    `- APENAS PORTUGUÊS. NÃO MISTURE COM INGLÊS OU OUTRO IDIOMA.`,
    `- Cada título e descrição deve ser uma frase completa com pontuação correta.`,
    `- NÃO inclua pontos incorretos, como pontos entre títulos ou após vírgulas.`,
    `- NÃO usar pontuação em excesso, como pontos em sequência ou vírgulas seguidas de pontos.`,
    `- NÃO criar dados fictícios ou genéricos`,
    `- O JSON deve ser válido com aspas duplas para todas as chaves e valores.`,
    ``,
    `Formato OBRIGATÓRIO de resposta (JSON):`,
    `[`,
    `  {`,
    `    "headline_1": "...",`,
    `    "headline_2": "...",`,
    `    "headline_3": "...",`,
    `    "description_1": "...",`,
    `    "description_2": "...",`,
    `    "display_url": "www.exemplo.com"`,
    `  }`,
    `]`
  ].join('\n');

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
      generic_terms: "servicios profesionales, resultados de qualidade",
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

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
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
      generic_terms: "servicios profesionales, resultados de qualidade",
      response_lang: "español"
    },
    en: {
      name: "English",
      generic_terms: "professional services, quality results",
      response_lang: "English"
    }
  }[languageCode];

  const systemMessage = [
    `Você é um redator publicitário sênior especializado em anúncios para Microsoft/Bing Ads.`,
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
    `Crie 5 anúncios de texto para Microsoft/Bing Ads usando exclusivamente os dados abaixo:`,
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
    `- Cada anúncio deve ter 3 títulos (máx 30 caracteres cada)`,
    `- 2 descrições (máx 90 caracteres cada)`,
    `- Um display_url baseado no site fornecido`,
    `- NÃO incluir texto em inglês ou outro idioma que não seja ${langInstructions.response_lang}`,
    `- NÃO criar dados fictícios ou genéricos`,
    `- O JSON deve ser válido com aspas duplas para todas as chaves e valores.`,
    ``,
    `Formato OBRIGATÓRIO de resposta (JSON):`,
    `[`,
    `  {`,
    `    "headline_1": "...",`,
    `    "headline_2": "...",`,
    `    "headline_3": "...",`,
    `    "description_1": "...",`,
    `    "description_2": "...",`,
    `    "display_url": "www.exemplo.com"`,
    `  }`,
    `]`
  ].join('\n');

  return { systemMessage, userMessage };
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
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
    `Você é um redator publicitário sênior especializado em anúncios para Instagram/Meta.`,
    `Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.`,
    `A resposta deve estar COMPLETAMENTE em ${langInstructions.name}.`,
    `IMPORTANTE:`,
    `- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.`,
    `- NUNCA use termos genéricos como "${langInstructions.generic_terms}" ou similares.`,
    `- Use APENAS as informações fornecidas abaixo.`,
    `- Ignore campos em branco (NÃO invente dados).`,
    `- CADA ANÚNCIO DEVE TER UM IMAGE_PROMPT DETALHADO E ESPECÍFICO.`,
    `- Retorne APENAS o JSON formatado conforme o exemplo.`,
    `- Valide que a resposta esteja no formato JSON usando aspas duplas corretas (não use aspas simples) para cada chave e valor.`,
  ].join('\n');

  const userMessage = [
    `Crie 5 anúncios para Instagram/Meta usando exclusivamente os dados abaixo:`,
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
    `- Cada anúncio deve ter um título atraente (headline)`,
    `- Texto principal (primaryText) envolvente (legenda do Instagram)`,
    `- Descrição de suporte (description)`,
    `- OBRIGATÓRIO: Um prompt detalhado para gerar imagem (image_prompt) sem texto sobreposto`,
    `- NÃO incluir texto em inglês ou outro idioma que não seja ${langInstructions.response_lang}`,
    `- NÃO criar dados fictícios ou genéricos`,
    `- O JSON deve ser válido com aspas duplas para todas as chaves e valores.`,
    ``,
    `O CAMPO IMAGE_PROMPT É CRUCIAL. Ele deve:`,
    `- Descrever uma imagem específica, atraente e profissional`,
    `- Ser detalhado o suficiente para gerar uma imagem de alta qualidade`,
    `- Ter no mínimo 20 palavras`,
    `- Relacionar-se ao produto/serviço da empresa`,
    `- NÃO incluir texto na imagem`,
    `- NÃO ser genérico ("imagem profissional de alta qualidade")`,
    ``,
    `Formato OBRIGATÓRIO de resposta (JSON):`,
    `[`,
    `  {`,
    `    "headline": "...",`,
    `    "primaryText": "...",`,
    `    "description": "...",`,
    `    "image_prompt": "Fotografia profissional mostrando..."`,
    `  }`,
    `]`
  ].join('\n');

  return { systemMessage, userMessage };
}
