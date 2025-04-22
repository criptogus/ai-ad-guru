
import { WebsiteAnalysisResult } from "./types.ts";

interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const language = campaignData.language || "Portuguese";

  const systemMessage = `
Você é um redator publicitário sênior especializado em anúncios de Google Ads.
Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.
A resposta deve estar COMPLETAMENTE em ${language.toUpperCase()}.
IMPORTANTE: 
- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.
- NUNCA use termos genéricos como "professional services", "quality results" ou similares.
- Use APENAS as informações fornecidas abaixo.
- Ignore campos em branco (NÃO invente dados).
- Retorne APENAS o JSON formatado conforme o exemplo.
`;

  const userMessage = `
Crie 5 anúncios de texto para Google Ads usando exclusivamente os dados abaixo:

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
- Cada anúncio deve ter 3 títulos (máx 30 caracteres cada)
- 2 descrições (máx 90 caracteres cada)
- Um display_url baseado no site fornecido
- NÃO incluir texto em inglês ou outro idioma que não seja ${language}
- NÃO criar dados fictícios ou genéricos

Formato OBRIGATÓRIO de resposta (JSON):
[
  {
    "headline_1": "...",
    "headline_2": "...",
    "headline_3": "...",
    "description_1": "...",
    "description_2": "...",
    "display_url": "www.exemplo.com"
  }
]
`;

  return { systemMessage, userMessage };
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const language = campaignData.language || "Portuguese";

  const systemMessage = `
Você é um redator publicitário sênior especializado em anúncios para LinkedIn.
Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.
A resposta deve estar COMPLETAMENTE em ${language.toUpperCase()}.
IMPORTANTE: 
- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.
- NUNCA use termos genéricos como "professional services", "quality results" ou similares.
- Use APENAS as informações fornecidas abaixo.
- Ignore campos em branco (NÃO invente dados).
- Retorne APENAS o JSON formatado conforme o exemplo.
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
- NÃO incluir texto em inglês ou outro idioma que não seja ${language}
- NÃO criar dados fictícios ou genéricos

Formato OBRIGATÓRIO de resposta (JSON):
[
  {
    "headline": "...",
    "primaryText": "...",
    "description": "...",
    "image_prompt": "Foto profissional mostrando..."
  }
]
`;

  return { systemMessage, userMessage };
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const language = campaignData.language || "Portuguese";

  const systemMessage = `
Você é um redator publicitário sênior especializado em anúncios para Microsoft/Bing Ads.
Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.
A resposta deve estar COMPLETAMENTE em ${language.toUpperCase()}.
IMPORTANTE: 
- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.
- NUNCA use termos genéricos como "professional services", "quality results" ou similares.
- Use APENAS as informações fornecidas abaixo.
- Ignore campos em branco (NÃO invente dados).
- Retorne APENAS o JSON formatado conforme o exemplo.
`;

  const userMessage = `
Crie 5 anúncios de texto para Microsoft/Bing Ads usando exclusivamente os dados abaixo:

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
- Cada anúncio deve ter 3 títulos (máx 30 caracteres cada)
- 2 descrições (máx 90 caracteres cada)
- Um display_url baseado no site fornecido
- NÃO incluir texto em inglês ou outro idioma que não seja ${language}
- NÃO criar dados fictícios ou genéricos

Formato OBRIGATÓRIO de resposta (JSON):
[
  {
    "headline_1": "...",
    "headline_2": "...",
    "headline_3": "...",
    "description_1": "...",
    "description_2": "...",
    "display_url": "www.exemplo.com"
  }
]
`;

  return { systemMessage, userMessage };
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const language = campaignData.language || "Portuguese";

  const systemMessage = `
Você é um redator publicitário sênior especializado em anúncios para Instagram/Meta.
Sua tarefa é criar anúncios altamente conversivos e NUNCA INVENTAR INFORMAÇÕES NÃO FORNECIDAS.
A resposta deve estar COMPLETAMENTE em ${language.toUpperCase()}.
IMPORTANTE: 
- JAMAIS misture idiomas, seja 100% fiel ao idioma escolhido.
- NUNCA use termos genéricos como "professional services", "quality results" ou similares.
- Use APENAS as informações fornecidas abaixo.
- Ignore campos em branco (NÃO invente dados).
- CADA ANÚNCIO DEVE TER UM IMAGE_PROMPT DETALHADO E ESPECÍFICO.
- Retorne APENAS o JSON formatado conforme o exemplo.
`;

  const userMessage = `
Crie 5 anúncios para Instagram/Meta usando exclusivamente os dados abaixo:

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
- Cada anúncio deve ter um título atraente (headline)
- Texto principal (primaryText) envolvente (legenda do Instagram)
- Descrição de suporte (description)
- OBRIGATÓRIO: Um prompt detalhado para gerar imagem (image_prompt) sem texto sobreposto
- NÃO incluir texto em inglês ou outro idioma que não seja ${language}
- NÃO criar dados fictícios ou genéricos

O CAMPO IMAGE_PROMPT É CRUCIAL. Ele deve:
- Descrever uma imagem específica, atraente e profissional
- Ser detalhado o suficiente para gerar uma imagem de alta qualidade
- Ter no mínimo 20 palavras
- Relacionar-se ao produto/serviço da empresa
- NÃO incluir texto na imagem
- NÃO ser genérico ("imagem profissional de alta qualidade")

Formato OBRIGATÓRIO de resposta (JSON):
[
  {
    "headline": "...",
    "primaryText": "...",
    "description": "...",
    "image_prompt": "Fotografia profissional mostrando..."
  }
]
`;

  return { systemMessage, userMessage };
}
