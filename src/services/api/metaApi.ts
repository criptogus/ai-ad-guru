
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

function ensureCompleteText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  // Adiciona ponto final se não terminar com pontuação
  const withPunctuation = /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + '.';
  // Corrige espaços após pontuação
  return withPunctuation.replace(/([.!?;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
}

// Função melhorada para detectar texto em inglês
const hasEnglishText = (text: string) => {
  if (!text) return false;
  
  // Lista expandida de palavras comuns em inglês que não deveriam aparecer
  const englishWords = [
    'the', 'your', 'quality', 'service', 'with', 'and', 'for', 'our',
    'you', 'we', 'business', 'transform', 'get', 'now', 'more', 'learn',
    'discover', 'solutions', 'best', 'from', 'about', 'how'
  ];
  
  // Verifica a presença de termos em inglês
  const textLower = text.toLowerCase();
  return englishWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(textLower);
  });
};

export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Gerando anúncios Meta para:', campaignData.companyName);
    console.log('Usando mind trigger:', mindTrigger || 'Nenhum');
    console.log('Idioma da campanha:', campaignData.language || 'português');

    // Forçando idioma português para garantir consistência
    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR', // Formato mais explícito para APIs
      languageName: 'português', // Nome explícito do idioma
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
          language: 'pt_BR', // Reforçando no nível mais externo
          languagePreference: 'Português do Brasil', // Texto explícito
          forcePortuguese: true, // Flag adicional
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

    // Validação aprimorada para garantir completude do anúncio
    if (!data.data.every((ad: any) => ad.headline && (ad.primaryText || ad.text) && ad.imagePrompt)) {
      console.warn("Alguns anúncios gerados estão incompletos:", data.data);
      toast.warning("Atenção: Alguns anúncios podem estar incompletos", {
        description: "Revise os campos dos anúncios antes de publicar."
      });
    }

    const metaAds = data.data.map((ad: any) => {
      const metaAd = {
        headline: ensureCompleteText(ad.headline || ''),
        primaryText: ensureCompleteText(ad.primaryText || ad.text || ''),
        description: ensureCompleteText(ad.description || ''),
        imagePrompt: ad.imagePrompt ?? ad.image_prompt ?? '[FALHA AO GERAR PROMPT DE IMAGEM]',
        callToAction: ad.callToAction ?? 'Saiba Mais',
        format: ad.format ?? 'feed',
        isComplete: true,
        imageUrl: ad.imageUrl || '', // Adiciona suporte para URL da imagem
      };

      // Validar consistência de idioma com feedback mais detalhado
      if (hasEnglishText(metaAd.headline) || hasEnglishText(metaAd.primaryText)) {
        console.warn('Texto em inglês detectado no anúncio:', {
          headline: metaAd.headline,
          primaryText: metaAd.primaryText?.substring(0, 100) + '...'
        });
        toast.warning('Conteúdo em inglês detectado', {
          description: 'Alguns textos dos anúncios podem não estar em português.'
        });
      }

      return metaAd;
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
