
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Gerando anúncios Meta para:', campaignData.companyName);
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
        platform: 'meta',
        campaignData: updatedCampaignData,
        mindTrigger,
        systemInstructions: "Sua resposta DEVE ser em português do Brasil. Não use inglês em nenhuma parte do texto."
      },
    });

    if (error) {
      console.error('Erro ao gerar anúncios Meta:', error);
      toast.error('Falha ao gerar anúncios Meta', {
        description: error.message || 'Erro desconhecido'
      });
      return null;
    }

    if (!data?.success) {
      // Verificar especificamente erros de crédito
      if (data?.errorCode === 'INSUFFICIENT_CREDITS') {
        toast.error('Créditos insuficientes', {
          description: `Você precisa de ${data?.creditsRequired || 5} créditos para gerar anúncios Meta. Disponível: ${data?.creditsAvailable || 0}`
        });
        return null;
      }
      
      console.error('Falha na geração de anúncios Meta:', data?.error || 'Erro desconhecido');
      toast.error('Falha na geração de anúncios Meta', {
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

    const metaAds = data.data;
    
    console.log('Anúncios Meta gerados com sucesso:', metaAds.length);
    
    return metaAds;
  } catch (error) {
    console.error('Erro em generateMetaAds:', error);
    toast.error('Erro ao gerar anúncios Meta', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
