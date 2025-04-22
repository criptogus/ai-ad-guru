
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
        mindTrigger,
        temperature: 0.3 // Lower temperature for more consistent results
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
      
      // Try to parse if string was returned
      if (typeof data.data === 'string') {
        try {
          const parsedData = JSON.parse(data.data);
          console.log('Successfully parsed string response to JSON:', parsedData);
          
          if (Array.isArray(parsedData)) {
            // Ensure all required fields are present
            const validatedAds = parsedData.map((ad: any) => ({
              headline1: ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '',
              headline2: ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '',
              headline3: ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || '',
              description1: ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '',
              description2: ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || '',
              displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'example.com',
              path1: ad.path1 || ad.path_1 || '',
              path2: ad.path2 || ad.path_2 || '',
              siteLinks: ad.siteLinks || ad.site_links || [],
            }));
            
            console.log('🧪 Validated Google ads:', validatedAds);
            return validatedAds as GoogleAd[];
          }
        } catch (parseError) {
          console.error('Failed to parse string response as JSON:', parseError);
          return null;
        }
      }
      
      return null;
    }

    console.log('Google ads generated successfully:', data.data);
    console.log('🧪 First ad sample:', data.data[0]);
    
    // Ensure all required fields are present
    const validatedAds = data.data.map((ad: any) => ({
      headline1: ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '',
      headline2: ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '',
      headline3: ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || '',
      description1: ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '',
      description2: ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || '',
      displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'example.com',
      path1: ad.path1 || ad.path_1 || '',
      path2: ad.path2 || ad.path_2 || '',
      siteLinks: ad.siteLinks || ad.site_links || [],
    }));
    
    console.log('🧪 Validated Google ads:', validatedAds);
    return validatedAds as GoogleAd[];
  } catch (error) {
    console.error('Error in generateGoogleAds:', error);
    return null;
  }
};
