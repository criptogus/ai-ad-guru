
import { supabase } from '@/integrations/supabase/client';
import { GoogleAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

/**
 * Generates Google ad suggestions based on website analysis results
 * 
 * @param campaignData The website analysis result data
 * @param mindTrigger Optional mind trigger to enhance ad creation
 * @returns An array of GoogleAd objects or null if generation fails
 */
export const generateGoogleAds = async (
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string
): Promise<GoogleAd[] | null> => {
  try {
    console.log('Generating Google ads for:', campaignData.companyName);
    console.log('Using mind trigger:', mindTrigger || 'None');
    
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'google',
        campaignData,
        mindTrigger
      },
    });

    if (error) {
      console.error('Error generating Google ads:', error);
      return null;
    }

    if (!data || !data.success) {
      console.error('Google ads generation failed:', data?.error || 'Unknown error');
      return null;
    }

    console.log('Google ads generated successfully:', data.data);
    return data.data as GoogleAd[];
  } catch (error) {
    console.error('Error in generateGoogleAds:', error);
    return null;
  }
};
