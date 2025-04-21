
import { CampaignPromptData } from './types';

export const buildAdGenerationPrompt = (data: CampaignPromptData): string => {
  // Early validation of required fields
  if (!data.companyName || !data.websiteUrl || !data.objective || !data.targetAudience) {
    throw new Error('Missing required campaign data for prompt generation');
  }

  const prompt = `
Crie anúncios publicitários para os seguintes dados da empresa:

📌 Nome da empresa: ${data.companyName}
🌐 Site: ${data.websiteUrl}
🎯 Objetivo da campanha: ${data.objective}
👥 Público-alvo: ${data.targetAudience}
🔑 Produto/serviço promovido: ${data.product || data.objective}
💬 Tom de voz: ${data.brandTone || 'profissional'}
🚀 Diferenciais da empresa: ${data.differentials?.join(', ') || 'não especificado'}
🎯 Gatilho mental escolhido: ${data.mindTrigger || 'não especificado'}
🌎 Idioma do anúncio: ${data.language || 'portuguese'}
📊 Plataformas selecionadas: ${(data.platforms || ['google']).join(', ')}

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

Lembre-se: todos os textos devem estar em ${data.language || 'portuguese'}. Não use exemplos genéricos ou textos-modelo. Gere conteúdo criativo real baseado nos dados da empresa. Responda APENAS em ${data.language || 'portuguese'}. Não misture idiomas.`;

  console.log('Generated prompt:', prompt);
  return prompt;
};
