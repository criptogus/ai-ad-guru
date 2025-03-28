
import { supabase } from '@/integrations/supabase/client';
import { GoogleAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

/**
 * Generates Microsoft/Bing ad suggestions based on website analysis results
 * 
 * @param campaignData The website analysis result data
 * @param mindTrigger Optional mind trigger to enhance ad creation
 * @returns An array of GoogleAd objects or null if generation fails
 */
export const generateMicrosoftAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<GoogleAd[] | null> => {
  try {
    console.log('Generating Microsoft ads for:', campaignData.companyName);
    console.log('Using mind trigger:', mindTrigger || 'None');
    
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'microsoft',
        campaignData,
        mindTrigger
      },
    });

    if (error) {
      console.error('Error generating Microsoft ads:', error);
      return null;
    }

    if (!data || !data.success) {
      console.error('Microsoft ads generation failed:', data?.error || 'Unknown error');
      return null;
    }

    console.log('Microsoft ads generated successfully:', data.data);
    return data.data as GoogleAd[];
  } catch (error) {
    console.error('Error in generateMicrosoftAds:', error);
    return null;
  }
};
