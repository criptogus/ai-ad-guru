
import { WebsiteAnalysisResult } from "./types.ts";

interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const language = campaignData.language || "Portuguese";

  const systemMessage = `
Você é um redator publicitário sênior em uma agência global de marketing.
Você cria anúncios altamente conversivos, SEM INVENTAR NENHUM CONTEXTO.
Apenas use os dados que foram fornecidos abaixo. Se algo estiver ausente, ignore.
A resposta deve estar COMPLETAMENTE em ${language}.
Nunca misture idiomas. Nunca crie termos genéricos como "professional services" se isso não estiver nos dados.
`;

  const userMessage = `
Crie 5 anúncios de texto para Google Ads usando exclusivamente os dados abaixo:

- Empresa: ${campaignData.companyName}
- Website: ${campaignData.websiteUrl}
- Produto ou serviço: ${campaignData.product}
- Objetivo: ${campaignData.objective}
- Público-alvo: ${campaignData.targetAudience}
- Tom de voz: ${campaignData.brandTone}
- Gatilho mental: ${mindTrigger || 'nenhum'}
- Diferenciais: ${(Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || '')}
- Palavras-chave: ${(Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || '')}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || ''}

Requisitos:
- Cada anúncio deve ter 3 títulos (máx 30 caracteres cada)
- 2 descrições (máx 90 caracteres cada)
- Um display_url baseado no site fornecido
- NÃO incluir texto em inglês
- NÃO criar dados fictícios

Formato de resposta (JSON):
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
Você é um redator publicitário sênior em uma agência global de marketing.
Você cria anúncios altamente conversivos para LinkedIn, SEM INVENTAR NENHUM CONTEXTO.
Apenas use os dados que foram fornecidos abaixo. Se algo estiver ausente, ignore.
A resposta deve estar COMPLETAMENTE em ${language}.
Nunca misture idiomas. Nunca crie termos genéricos como "professional services" se isso não estiver nos dados.
`;

  const userMessage = `
Crie 5 anúncios para LinkedIn usando exclusivamente os dados abaixo:

- Empresa: ${campaignData.companyName}
- Website: ${campaignData.websiteUrl}
- Produto ou serviço: ${campaignData.product}
- Objetivo: ${campaignData.objective}
- Público-alvo: ${campaignData.targetAudience}
- Tom de voz: ${campaignData.brandTone}
- Gatilho mental: ${mindTrigger || 'nenhum'}
- Diferenciais: ${(Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || '')}
- Palavras-chave: ${(Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || '')}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || ''}

Requisitos:
- Cada anúncio deve ter um título atraente
- Texto principal profissional e persuasivo
- Descrição complementar
- Sugestão de imagem (sem texto sobreposto)
- NÃO incluir texto em inglês
- NÃO criar dados fictícios

Formato de resposta (JSON):
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

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const language = campaignData.language || "Portuguese";

  const systemMessage = `
Você é um redator publicitário sênior em uma agência global de marketing.
Você cria anúncios altamente conversivos para Microsoft/Bing Ads, SEM INVENTAR NENHUM CONTEXTO.
Apenas use os dados que foram fornecidos abaixo. Se algo estiver ausente, ignore.
A resposta deve estar COMPLETAMENTE em ${language}.
Nunca misture idiomas. Nunca crie termos genéricos como "professional services" se isso não estiver nos dados.
`;

  const userMessage = `
Crie 5 anúncios de texto para Microsoft/Bing Ads usando exclusivamente os dados abaixo:

- Empresa: ${campaignData.companyName}
- Website: ${campaignData.websiteUrl}
- Produto ou serviço: ${campaignData.product}
- Objetivo: ${campaignData.objective}
- Público-alvo: ${campaignData.targetAudience}
- Tom de voz: ${campaignData.brandTone}
- Gatilho mental: ${mindTrigger || 'nenhum'}
- Diferenciais: ${(Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || '')}
- Palavras-chave: ${(Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || '')}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || ''}

Requisitos:
- Cada anúncio deve ter 3 títulos (máx 30 caracteres cada)
- 2 descrições (máx 90 caracteres cada)
- Um display_url baseado no site fornecido
- NÃO incluir texto em inglês
- NÃO criar dados fictícios

Formato de resposta (JSON):
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
Você é um redator publicitário sênior em uma agência global de marketing.
Você cria anúncios altamente conversivos para Instagram/Meta, SEM INVENTAR NENHUM CONTEXTO.
Apenas use os dados que foram fornecidos abaixo. Se algo estiver ausente, ignore.
A resposta deve estar COMPLETAMENTE em ${language}.
Nunca misture idiomas. Nunca crie termos genéricos como "professional services" se isso não estiver nos dados.
`;

  const userMessage = `
Crie 5 anúncios para Instagram/Meta usando exclusivamente os dados abaixo:

- Empresa: ${campaignData.companyName}
- Website: ${campaignData.websiteUrl}
- Produto ou serviço: ${campaignData.product}
- Objetivo: ${campaignData.objective}
- Público-alvo: ${campaignData.targetAudience}
- Tom de voz: ${campaignData.brandTone}
- Gatilho mental: ${mindTrigger || 'nenhum'}
- Diferenciais: ${(Array.isArray(campaignData.uniqueSellingPoints) ? campaignData.uniqueSellingPoints.join(', ') : campaignData.uniqueSellingPoints || '')}
- Palavras-chave: ${(Array.isArray(campaignData.keywords) ? campaignData.keywords.join(', ') : campaignData.keywords || '')}
- Descrição: ${campaignData.companyDescription || campaignData.businessDescription || ''}

Requisitos:
- Cada anúncio deve ter um título atraente
- Texto principal (legenda) envolvente
- Descrição de suporte
- Sugestão de imagem (sem texto sobreposto)
- NÃO incluir texto em inglês
- NÃO criar dados fictícios

Formato de resposta (JSON):
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
