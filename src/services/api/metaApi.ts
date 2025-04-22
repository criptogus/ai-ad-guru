
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

/**
 * Generates Instagram/Meta ad suggestions based on website analysis results
 * 
 * @param campaignData The website analysis result data
 * @param mindTrigger Optional mind trigger to enhance ad creation
 * @returns An array of MetaAd objects or null if generation fails
 */
export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Generating Meta ads for:', campaignData.companyName);
    console.log('Using mind trigger:', mindTrigger || 'None');
    
    // Call the Supabase edge function to generate premium ads
    const { data, error } = await supabase.functions.invoke('generate-premium-ads', {
      body: { 
        platform: 'meta',
        campaignData: {
          ...campaignData,
          mindTriggers: {
            meta: mindTrigger
          }
        },
        language: 'portuguese' // Default language, should be set based on user preference
      },
    });

    if (error) {
      console.error('Error generating Meta ads:', error);
      toast.error('Falha ao gerar anúncios Meta', { 
        description: error.message || 'Erro desconhecido'
      });
      return null;
    }

    if (!data || !data.success) {
      console.error('Meta ads generation failed:', data?.error || 'Unknown error');
      toast.error('Falha na geração de anúncios Meta', { 
        description: data?.error || 'Não foi possível gerar o conteúdo dos anúncios'
      });
      return null;
    }

    console.log('Meta ads generated successfully:', data.data);
    
    // Transform the API response into our app's MetaAd format
    const metaAds = (data.data || []).map((ad: any) => ({
      headline: ad.headline || '',
      primaryText: ad.primaryText || ad.text || '',
      description: ad.description || '',
      imagePrompt: ad.imagePrompt || ad.image_prompt || '',
      callToAction: ad.callToAction || 'Saiba Mais',
      format: ad.format || 'feed'
    }));
    
    return metaAds;
  } catch (error) {
    console.error('Error in generateMetaAds:', error);
    toast.error('Erro ao gerar anúncios Meta', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
