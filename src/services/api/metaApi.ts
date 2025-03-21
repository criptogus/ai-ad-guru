
import { secureApi } from './secureApi';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { MetaAd } from '@/hooks/adGeneration';

/**
 * Generates Meta/Instagram Ads based on the provided campaign data and analysis
 * 
 * @param analysisResult - The website analysis results containing business data
 * @returns An array of generated Meta ads or null if generation fails
 */
export const generateMetaAds = async (
  analysisResult: WebsiteAnalysisResult
): Promise<MetaAd[] | null> => {
  try {
    console.log('Generating Meta ads with analysis data:', analysisResult);
    
    const response = await secureApi.post('/generate-ads', {
      platform: 'meta',
      campaignData: analysisResult
    }, { requiresAuth: true });

    console.log('Meta ads API response:', response);
    
    if (!response || !response.success || !response.data) {
      console.error('Failed to generate Meta ads:', response?.error || 'Unknown error');
      return null;
    }

    // Transform the API response to the MetaAd format
    const metaAds: MetaAd[] = response.data.map((ad: any) => ({
      headline: ad.headline || '',
      primaryText: ad.primaryText || '',
      description: ad.description || '',
      imagePrompt: ad.imagePrompt || ''
    }));

    console.log('Generated Meta ads:', metaAds);
    return metaAds;
  } catch (error) {
    console.error('Error generating Meta ads:', error);
    return null;
  }
};
