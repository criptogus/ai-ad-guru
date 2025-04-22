
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
    
    // Ensure we have the required data
    if (!campaignData || !campaignData.companyName) {
      console.error('Missing required campaign data for ad generation');
      return null;
    }
    
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

    // Validate response data structure
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Invalid response format from generate-ads:', data);
      return null;
    }

    console.log('Google ads generated successfully:', data.data);
    
    // Ensure all required fields are present
    const validatedAds = data.data.map((ad: any) => ({
      headline1: ad.headline_1 || ad.headline1 || '',
      headline2: ad.headline_2 || ad.headline2 || '',
      headline3: ad.headline_3 || ad.headline3 || '',
      description1: ad.description_1 || ad.description1 || '',
      description2: ad.description_2 || ad.description2 || '',
      displayPath: ad.display_url || ad.displayPath || 'example.com',
      path1: ad.path1 || '',
      path2: ad.path2 || '',
      siteLinks: ad.siteLinks || [],
    }));
    
    return validatedAds as GoogleAd[];
  } catch (error) {
    console.error('Error in generateGoogleAds:', error);
    return null;
  }
};
