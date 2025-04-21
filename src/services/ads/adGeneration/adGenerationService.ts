
import { errorLogger } from '@/services/libs/error-handling';
import { supabase } from '@/integrations/supabase/client';
import { CampaignPromptData, GeneratedAdContent } from './types';

export const generateAds = async (data: CampaignPromptData): Promise<GeneratedAdContent | null> => {
  try {
    console.log('Gerando anúncios com dados:', data);
    
    const { data: response, error } = await supabase.functions.invoke('generate-ads', {
      body: {
        prompt: buildPrompt(data),
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

const buildPrompt = (data: CampaignPromptData): string => {
  return `
📌 **Nome da empresa**: ${data.companyName}
🌐 **Site**: ${data.websiteUrl}
🎯 **Objetivo da campanha**: ${data.campaignObjective}
👥 **Público-alvo**: ${data.targetAudience}
🔑 **Produto/serviço promovido**: ${data.product}
💬 **Tom de voz**: ${data.brandTone}
🚀 **Diferenciais da empresa**: ${data.differentials.join(', ')}
🎯 **Gatilho mental escolhido**: ${data.mindTrigger}
🌎 **Idioma do anúncio**: ${data.language}
📊 **Plataformas selecionadas**: ${data.platforms.join(', ')}
  `.trim();
};
