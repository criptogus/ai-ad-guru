
import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData, GeneratedAdContent } from './types';

export const generateAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    console.log('Gerando anúncios com dados:', data);
    
    // Build a detailed prompt using the provided template structure
    const prompt = buildDetailedPrompt(data);
    
    const { data: response, error } = await supabase.functions.invoke('generate-ads', {
      body: {
        prompt,
        language: data.language
      }
    });
    
    if (error) {
      console.error('Erro ao gerar anúncios:', error);
      errorLogger.logError(error, 'generateAds');
      return null;
    }
    
    if (!response?.success || !response?.content) {
      console.error('Geração de anúncios falhou:', response?.error || 'Sem conteúdo gerado');
      return null;
    }
    
    return response.content;
  } catch (error) {
    errorLogger.logError(error, 'generateAds');
    return null;
  }
};

/**
 * Builds a detailed prompt for the OpenAI API, replacing all placeholders with actual data
 */
const buildDetailedPrompt = (data: CampaignPromptData): string => {
  // Standard prompt template with placeholders
  const promptTemplate = `Crie anúncios publicitários para os seguintes dados da empresa:

📌 **Nome da empresa**: {{nome_da_empresa}}  
🌐 **Site**: {{site_da_empresa}}  
🎯 **Objetivo da campanha**: {{objetivo_da_campanha}}  
👥 **Público-alvo**: {{publico_alvo}}  
🔑 **Produto/serviço promovido**: {{produto_servico}}  
💬 **Tom de voz**: {{tom_de_voz}}  
🚀 **Diferenciais da empresa**: {{diferenciais}}  
🎯 **Gatilho mental escolhido**: {{gatilho_mental}}  
🌎 **Idioma do anúncio**: {{idioma}}  
📊 **Plataformas selecionadas**: {{plataformas}}  

Siga as regras abaixo:

1. Gere 5 variações de **anúncios de texto** (respeitando os limites por plataforma).
2. Gere 5 **prompts para geração de imagem publicitária**, sem texto embutido na imagem, mas com composição visual clara para Instagram e LinkedIn (estilo agência de Nova York).
3. Use o contexto da marca, público e tom de voz para criar peças **altamente persuasivas** e adaptadas ao canal.
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

Lembre-se: todos os textos devem estar em {{idioma}}, e devem parecer criados por humanos com alto nível de criatividade e performance. Não use exemplos genéricos ou textos-modelo. Gere conteúdo criativo real baseado nos dados da empresa. Responda APENAS em {{idioma}}. Não misture idiomas.`;

  // Replace all placeholders with actual data
  const filledPrompt = promptTemplate
    .replace('{{nome_da_empresa}}', data.companyName)
    .replace('{{site_da_empresa}}', data.websiteUrl)
    .replace('{{objetivo_da_campanha}}', data.campaignObjective)
    .replace('{{publico_alvo}}', data.targetAudience)
    .replace('{{produto_servico}}', data.product)
    .replace('{{tom_de_voz}}', data.brandTone)
    .replace('{{diferenciais}}', data.differentials.join(', '))
    .replace('{{gatilho_mental}}', data.mindTrigger)
    .replace(/{{idioma}}/g, data.language) // Replace all instances of language
    .replace('{{plataformas}}', data.platforms.join(', '));

  console.log('Prompt completo para geração de anúncios:', filledPrompt.substring(0, 200) + '...');
  return filledPrompt;
};
