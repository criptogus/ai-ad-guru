
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '../useWebsiteAnalysis';
import { MetaAd } from './types';

export const useMetaAds = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const { toast } = useToast();

  const generateMetaAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    
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
        toast({
          title: "Generation Failed",
          description: error.message || "Failed to generate Meta ads",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        console.error('Meta ads generation failed:', data.error);
        toast({
          title: "Generation Failed",
          description: data.error || "Failed to generate Meta ads",
          variant: "destructive",
        });
        return null;
      }

      console.log('Meta ads generated successfully:', data.data);
      const ads = data.data as MetaAd[];
      setMetaAds(ads);
      
      toast({
        title: "Ads Generated",
        description: `Successfully generated ${ads.length} Meta/Instagram ad variations`,
      });
      
      return ads;
    } catch (error) {
      console.error('Error generating Meta ads:', error);
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
    generateMetaAds,
    isGenerating,
    metaAds,
  };
};
