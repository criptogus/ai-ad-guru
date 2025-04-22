
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

      // Use unified error handling/toast
      if (apiError || !data?.success) {
        const message = apiError?.message || data?.error || "Failed to generate Google ads";
        console.error("Error generating Google ads:", message);
        setError(message);

        toast({
          title: "Generation Failed",
          description: message,
          variant: "destructive",
        });

        return null;
      }

      // NOTE: The backend currently returns ads in data.data (ambiguous)
      // Prefer backend to use { success: true, ads: [...] } in future
      const ads = data.data as GoogleAd[];
      console.log('Google ads generated successfully:', ads);
      setGoogleAds(ads);

      if (!ads || ads.length === 0) {
        toast({
          title: "No Ads Generated",
          description: "No Google Ads were generated from this input.",
          variant: "default",
        });
        return ads;
      }

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
    setGoogleAds,
    error
  };
};
