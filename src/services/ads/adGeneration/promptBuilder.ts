
import { CampaignPromptData, PromptMessages } from './types/promptTypes';

export const buildAdGenerationPrompt = (data: CampaignPromptData): PromptMessages => {
  // Early validation of required fields
  if (!data.companyName || !data.websiteUrl || !data.objective || !data.targetAudience) {
    throw new Error('Missing required campaign data for prompt generation');
  }

  // Ensure we have a language, defaulting to Portuguese
  const language = data.language || 'portuguese';
  
  // Get formatted differentials
  const differentials = data.differentials?.join(', ') || 'não especificado';
  
  // Build the system message for the AI
  const systemMessage = `Você é um redator e designer de anúncios de uma agência premiada, especialista em criar campanhas com alta conversão. 
Sua missão é criar textos e imagens para anúncios em Google Ads, Instagram, LinkedIn e Microsoft Ads com base no contexto fornecido, 
garantindo relevância, originalidade, coerência e persuasão. Você sempre respeita o idioma da campanha (${language}) 
e os formatos exigidos por cada plataforma.`;

  // Build the user message with all campaign details
  const userMessage = `Use os dados abaixo para gerar os anúncios:

### 📌 Empresa
- Nome: ${data.companyName}
- Site: ${data.websiteUrl}

### 🎯 Campanha
- Objetivo da campanha: ${data.objective}
- Produto/serviço promovido: ${data.product || data.objective}
- Público-alvo: ${data.targetAudience}
- Tom de voz: ${data.brandTone || 'profissional'}
- Diferenciais da empresa: ${differentials}
- Gatilho mental principal: ${data.mindTrigger || ''}
- Idioma da campanha: ${language}

### 🧠 Regras para geração:
1. Utilize APENAS o idioma ${language} em TODOS os textos, sem exceção.
2. Use linguagem adaptada ao público e tom de voz da marca.
3. Para cada plataforma, siga as práticas recomendadas de copywriting.
4. Gere variações realistas e otimizadas para conversão.
5. Crie prompts de imagem (sem texto sobreposto) para Instagram e LinkedIn, com estilo fotográfico premium e contexto visual alinhado à campanha.

### 📦 Estrutura de saída esperada (JSON):
{
  "google_ads": [
    {
      "headline_1": "",
      "headline_2": "",
      "headline_3": "",
      "description_1": "",
      "description_2": "",
      "display_url": ""
    }
  ],
  "instagram_ads": [
    {
      "text": "",
      "image_prompt": ""
    }
  ],
  "linkedin_ads": [
    {
      "text": "",
      "image_prompt": ""
    }
  ],
  "microsoft_ads": [
    {
      "headline_1": "",
      "headline_2": "",
      "description": "",
      "display_url": ""
    }
  ]
}

### 📌 Observações importantes:
- TODOS os textos devem estar em ${language} e NUNCA em outro idioma.
- Os textos devem parecer escritos por humanos com domínio em marketing.
- Os prompts de imagem devem descrever visualmente a campanha (produto, persona, emoção, estética), sem mencionar marcas genéricas ou escrever texto na imagem.
- Os prompts de imagem devem ser detalhados, específicos para ${data.companyName} e contextualmente relevantes ao negócio.
- Gere resultados como se fossem criados por uma agência sênior de Nova York ou Londres.
- NUNCA use palavras em inglês se o idioma for português, nem português se o idioma for inglês.
- NUNCA use texto genérico ou óbvio como "Your Company" ou "Sua Empresa".

Retorne apenas o JSON, sem explicações adicionais.`;

  return {
    systemMessage,
    userMessage
  };
};
