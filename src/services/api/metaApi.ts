import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

function detectAndFixEnglish(text: string): string {
  if (!text) return "";
  const translations: Record<string, string> = {
    'Learn More': 'Saiba Mais',
    'Get Started': 'Comece Agora',
    'Discover': 'Descubra',
    'Contact Us': 'Entre em Contato',
    'with': 'com',
    'for': 'para',
    'your': 'seu',
    'our': 'nosso',
    'business': 'negócio',
    'and': 'e',
    'services': 'serviços',
    'solutions': 'soluções',
    'the': 'o',
    'Transform': 'Transforme'
  };
  let fixedText = text;
  Object.entries(translations).forEach(([english, portuguese]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    fixedText = fixedText.replace(regex, portuguese);
  });
  return fixedText;
}

function fixPunctuation(text: string): string {
  if (!text) return "";
  let fixedText = text.replace(/,\./g, ',');
  fixedText = fixedText.replace(/\.{2,}/g, '.');
  fixedText = fixedText.replace(/\s+([,.!?;:])/g, '$1');
  fixedText = fixedText.replace(/([,.!?;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
  fixedText = fixedText.replace(/([,.!?;:])\1+/g, '$1');
  fixedText = fixedText.replace(/\s+/g, ' ').trim();
  if (!/[.!?]$/.test(fixedText)) {
    fixedText = fixedText + '.';
  }
  return fixedText;
}

export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Gerando anúncios Meta para:', campaignData.companyName);
    console.log('Usando mind trigger:', mindTrigger || 'Nenhum');
    console.log('Idioma da campanha:', campaignData.language || 'português');

    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR',
      languageName: 'português',
    };

    console.log('Enviando requisição com idioma forçado:', updatedCampaignData.language);

    const { data, error } = await supabase.functions.invoke('generate-premium-ads', {
      body: {
        platform: 'meta',
        campaignData: {
          ...updatedCampaignData,
          mindTriggers: {
            meta: mindTrigger
          },
          language: 'pt_BR',
          languagePreference: 'Português do Brasil',
          forcePortuguese: true,
        }
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

    // Normalize and force correct language/punctuation
    const metaAds = data.data.map((ad: any) => {
      const headlineRaw = ad.headline || '';
      const primaryTextRaw = ad.primaryText || ad.text || '';
      const descriptionRaw = ad.description || '';
      const headline = fixPunctuation(detectAndFixEnglish(headlineRaw));
      const primaryText = fixPunctuation(detectAndFixEnglish(primaryTextRaw));
      const description = fixPunctuation(detectAndFixEnglish(descriptionRaw));
      return {
        headline,
        primaryText,
        description,
        imagePrompt: ad.imagePrompt ?? ad.image_prompt ?? '[FALHA AO GERAR PROMPT DE IMAGEM]',
        callToAction: ad.callToAction ?? 'Saiba Mais',
        format: ad.format ?? 'feed',
        isComplete: true,
        imageUrl: ad.imageUrl || '',
      };
    });

    // Check for any remaining English and warn
    metaAds.forEach(metaAd => {
      if (
        /(\bthe\b|\byour\b|service|quality|contact|learn|solutions)/i.test(
          metaAd.headline + metaAd.primaryText
        )
      ) {
        toast.warning('Conteúdo em inglês detectado', {
          description: 'Alguns textos dos anúncios podem não estar em português.'
        });
      }
    });

    console.log('Anúncios Meta gerados com sucesso:', metaAds.length);
    console.log('Exemplo de anúncio gerado:', JSON.stringify(metaAds[0], null, 2));
    
    return metaAds;
  } catch (error) {
    console.error('Erro em generateMetaAds:', error);
    toast.error('Erro ao gerar anúncios Meta', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
