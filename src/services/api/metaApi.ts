
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

function ensureCompleteText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  return /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + '.';
}

// New utility to detect non-Portuguese text
const hasEnglishText = (text: string) => /\b(the|your|quality|service)\b/i.test(text);

export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Generating Meta ads for:', campaignData.companyName);
    console.log('Using mind trigger:', mindTrigger || 'None');
    console.log('Campaign language:', campaignData.language || 'português');

    const { data, error } = await supabase.functions.invoke('generate-premium-ads', {
      body: {
        platform: 'meta',
        campaignData: {
          ...campaignData,
          language: campaignData.language || 'português',
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

    if (!Array.isArray(data.data)) {
      console.error('Resposta inválida da IA:', data.data);
      toast.error('Erro de formato', {
        description: 'A resposta da IA não estava no formato esperado.'
      });
      return null;
    }

    // Enhanced validation to ensure ad completeness
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

      // Validate language consistency
      if (campaignData.language?.toLowerCase() === 'português') {
        if ([metaAd.headline, metaAd.primaryText, metaAd.description].some(hasEnglishText)) {
          console.warn('Anúncio com conteúdo em inglês detectado:', metaAd);
          toast.warning('Conteúdo em inglês detectado', {
            description: 'Alguns textos dos anúncios podem não estar em português.'
          });
        }
      }

      return metaAd;
    });

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
