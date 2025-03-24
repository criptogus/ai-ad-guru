
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

/**
 * Generates Instagram/Meta ad suggestions based on website analysis results
 * 
 * @param campaignData The website analysis result data
 * @returns An array of MetaAd objects or null if generation fails
 */
export const generateMetaAds = async (campaignData: WebsiteAnalysisResult): Promise<MetaAd[] | null> => {
  try {
    console.log('Generating Meta ads for:', campaignData.companyName);
    
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'meta',
        campaignData 
      },
    });

    if (error) {
      console.error('Error generating Meta ads:', error);
      return null;
    }

    if (!data.success) {
      console.error('Meta ads generation failed:', data.error);
      return null;
    }

    console.log('Meta ads generated successfully:', data.data);
    return data.data as MetaAd[];
  } catch (error) {
    console.error('Error in generateMetaAds:', error);
    return null;
  }
};
