
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '../useWebsiteAnalysis';
import { GoogleAd } from './types';

export const useGoogleAds = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const { toast } = useToast();

  const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating Google ads for:', campaignData.companyName);
      
      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: { 
          platform: 'google',
          campaignData 
        },
      });

      if (error) {
        console.error('Error generating Google ads:', error);
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate Google ads",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        console.error('Google ads generation failed:', data.error);
        toast({
          title: "Generation Failed",
          description: data.error || "Failed to generate Google ads",
          variant: "destructive",
        });
        return null;
      }

      console.log('Google ads generated successfully:', data.data);
      const ads = data.data as GoogleAd[];
      setGoogleAds(ads);
      
      toast({
        title: "Ads Generated",
        description: `Successfully generated ${ads.length} Google ad variations`,
      });
      
      return ads;
    } catch (error) {
      console.error('Error generating Google ads:', error);
      toast({
        title: "Generation Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateGoogleAds,
    isGenerating,
    googleAds,
  };
};
