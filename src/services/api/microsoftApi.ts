
import { supabase } from '@/integrations/supabase/client';
import { GoogleAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

export const generateMicrosoftAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<GoogleAd[] | null> => {
  try {
    console.log('Gerando anúncios Microsoft para:', campaignData.companyName);
    console.log('Usando mind trigger:', mindTrigger || 'Nenhum');
    
    // Forçar idioma português
    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR',
      languageName: 'português',
      forcePortuguese: true,
      languagePreference: 'Português do Brasil'
    };

    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'microsoft',
        campaignData: updatedCampaignData,
        mindTrigger,
        systemInstructions: "Sua resposta DEVE ser em português do Brasil. Não use inglês em nenhuma parte do texto."
      },
    });

    if (error) {
      console.error('Erro ao gerar anúncios Microsoft:', error);
      toast.error('Falha ao gerar anúncios Microsoft', {
        description: error.message || 'Erro desconhecido'
      });
      return null;
    }

    if (!data?.success) {
      // Verificar especificamente erros de crédito
      if (data?.errorCode === 'INSUFFICIENT_CREDITS') {
        toast.error('Créditos insuficientes', {
          description: `Você precisa de ${data?.creditsRequired || 5} créditos para gerar anúncios Microsoft. Disponível: ${data?.creditsAvailable || 0}`
        });
        return null;
      }
      
      console.error('Falha na geração de anúncios Microsoft:', data?.error || 'Erro desconhecido');
      toast.error('Falha na geração de anúncios Microsoft', {
        description: data?.error || 'Não foi possível gerar o conteúdo dos anúncios'
      });
      return null;
    }

    if (!Array.isArray(data.data)) {
      console.error('Resposta inválida da IA:', data.data);
      toast.error('Erro de formato', {
        description: 'A resposta da IA não estava no formato esperado.'
      });
      return null;
    }

    const microsoftAds = data.data;
    
    console.log('Anúncios Microsoft gerados com sucesso:', microsoftAds.length);
    
    return microsoftAds;
  } catch (error) {
    console.error('Erro em generateMicrosoftAds:', error);
    toast.error('Erro ao gerar anúncios Microsoft', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
