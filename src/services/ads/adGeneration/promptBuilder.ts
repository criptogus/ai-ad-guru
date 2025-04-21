
import { CampaignPromptData } from './types';

export const buildAdGenerationPrompt = (data: CampaignPromptData): string => {
  // Early validation of required fields
  if (!data.companyName || !data.websiteUrl || !data.objective || !data.targetAudience) {
    throw new Error('Missing required campaign data for prompt generation');
  }

  // Ensure we have a language, defaulting to Portuguese
  const language = data.language || 'portuguese';
  const mindTrigger = data.mindTrigger || '';
  const platforms = (data.platforms || ['google']).join(', ');
  const differentials = data.differentials?.join(', ') || 'não especificado';

  console.log(`Building prompt for ${platforms} in ${language} language`);

  const prompt = `
Crie anúncios publicitários para os seguintes dados da empresa:

📌 Nome da empresa: ${data.companyName}
🌐 Site: ${data.websiteUrl}
🎯 Objetivo da campanha: ${data.objective}
👥 Público-alvo: ${data.targetAudience}
🔑 Produto/serviço promovido: ${data.product || data.objective}
💬 Tom de voz: ${data.brandTone || 'profissional'}
🚀 Diferenciais da empresa: ${differentials}
🎯 Gatilho mental escolhido: ${mindTrigger}
🌎 Idioma do anúncio: ${language}
📊 Plataformas selecionadas: ${platforms}

Siga as regras abaixo:

1. Gere 5 variações de anúncios de texto (respeitando os limites por plataforma).
2. Gere 5 prompts para geração de imagem publicitária, SEM texto embutido na imagem, mas com composição visual clara para Instagram e LinkedIn (estilo agência de Nova York).
3. Use o contexto da marca, público e tom de voz para criar peças altamente persuasivas e adaptadas ao canal.
4. Utilize técnicas de copywriting (AIDA, PAS, perguntas no título etc.).
5. Destaque benefícios e CTA direto.
6. Responda apenas com um JSON estruturado assim:

{
  "google_ads": [
    {
      "headline_1": "",
      "headline_2": "",
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
      "description": ""
    }
  ]
}

INSTRUÇÕES IMPORTANTES:
- Todos os textos DEVEM estar em ${language}. 
- NÃO misture idiomas.
- Os prompts de imagem devem descrever detalhadamente uma cena contextualizada ao negócio, NUNCA use frases genéricas como "Professional image for [company]".
- Descreva a cena, o público, o ambiente e o objetivo do negócio nos prompts de imagem.
- NÃO use palavras em inglês em anúncios em português.
- NÃO use exemplo genéricos ou modelos de texto. Crie conteúdo específico e relevante baseado na empresa.
- Responda APENAS em ${language}.`;

  console.log('Generated prompt:', prompt.substring(0, 150) + '...');
  return prompt;
};
