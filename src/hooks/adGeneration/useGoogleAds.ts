
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '../useWebsiteAnalysis';
import { GoogleAd } from './types';

export const useGoogleAds = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('Generating Google ads for:', campaignData.companyName);
      
      const { data, error: apiError } = await supabase.functions.invoke('generate-ads', {
        body: { 
          platform: 'google',
          campaignData 
        },
      });

      if (apiError) {
        console.error('Error generating Google ads:', apiError);
        setError(apiError.message);
        toast({
          title: "Generation Failed",
          description: apiError.message || "Failed to generate Google ads",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        console.error('Google ads generation failed:', data.error);
        setError(data.error);
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
      setError(error instanceof Error ? error.message : "Unknown error");
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
    error
  };
};
