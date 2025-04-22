
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

/**
 * Valida e garante que o texto termina com a pontuação adequada
 */
function ensureCompleteText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  return /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + '.';
}

/**
 * Gera sugestões de anúncios Instagram/Meta a partir da análise do site
 */
export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Generating Meta ads for:', campaignData.companyName);
    console.log('Using mind trigger:', mindTrigger || 'None');

    // Refatorado: Inclui sempre a linguagem no campaignData
    const { data, error } = await supabase.functions.invoke('generate-premium-ads', {
      body: {
        platform: 'meta',
        campaignData: {
          ...campaignData,
          language: campaignData.language || 'portuguese',
          mindTriggers: {
            meta: mindTrigger
          }
        }
      },
    });

    if (error) {
      console.error('Error generating Meta ads:', error);
      toast.error('Falha ao gerar anúncios Meta', {
        description: error.message || 'Erro desconhecido'
      });
      return null;
    }

    if (!data?.success) {
      console.error('Meta ads generation failed:', data?.error || 'Unknown error');
      toast.error('Falha na geração de anúncios Meta', {
        description: data?.error || 'Não foi possível gerar o conteúdo dos anúncios'
      });
      return null;
    }

    // NOVO: Validação do formato do retorno
    if (!Array.isArray(data.data)) {
      console.error('Resposta inválida da IA:', data.data);
      toast.error('Erro de formato', {
        description: 'A resposta da IA não estava no formato esperado.'
      });
      return null;
    }

    // Map estrutura normalizada + melhor fallback de prompt (nullish coalescing)
    const metaAds = data.data.map((ad: any) => ({
      headline: ensureCompleteText(ad.headline || ''),
      primaryText: ensureCompleteText(ad.primaryText || ad.text || ''),
      description: ensureCompleteText(ad.description || ''),
      imagePrompt: ad.imagePrompt ?? ad.image_prompt ?? '',
      callToAction: ad.callToAction ?? 'Saiba Mais',
      format: ad.format ?? 'feed',
      isComplete: true // Marcação
    }));

    console.log('Meta ads generated successfully:', metaAds);
    return metaAds;
  } catch (error) {
    console.error('Error in generateMetaAds:', error);
    toast.error('Erro ao gerar anúncios Meta', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
