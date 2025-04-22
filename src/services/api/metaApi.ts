
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
    
    // Call the Supabase edge function to generate ads
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'meta',
        campaignData: {
          ...campaignData,
          mindTrigger
        }
      },
    });

    if (error) {
      console.error('Error generating Meta ads:', error);
      toast.error('Failed to generate Meta ads', { 
        description: error.message || 'Unknown error'
      });
      return null;
    }

    if (!data || !data.success) {
      console.error('Meta ads generation failed:', data?.error || 'Unknown error');
      toast.error('Meta ads generation failed', { 
        description: data?.error || 'Failed to generate ads content'
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
      callToAction: ad.callToAction || 'Learn More',
      format: ad.format || 'feed'
    }));
    
    return metaAds;
  } catch (error) {
    console.error('Error in generateMetaAds:', error);
    toast.error('Error generating Meta ads', {
      description: error instanceof Error ? error.message : 'Unknown error occurred'
    });
    return null;
  }
};
