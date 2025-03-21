
import { useState } from 'react';
import { MetaAd } from './types';
import { generateMetaAds as apiGenerateMetaAds } from '@/services/api/metaApi';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { useToast } from '@/hooks/use-toast';

export const useMetaAds = () => {
  const [metaAds, setMetaAds] = useState<MetaAd[]>([]);
  const { toast } = useToast();

  const generateMetaAds = async (campaignData: WebsiteAnalysisResult): Promise<MetaAd[] | null> => {
    try {
      console.log("useMetaAds - Generating Meta ads with data:", campaignData);
      
      // Call the API to generate Meta ads
      const generatedAds = await apiGenerateMetaAds(campaignData);
      
      if (!generatedAds || generatedAds.length === 0) {
        toast({
          title: "Unable to generate Instagram ads",
          description: "There was a problem generating ad suggestions. Please try again.",
          variant: "destructive",
        });
        return null;
      }
      
      // Update the state with the generated ads
      setMetaAds(generatedAds);
      console.log("useMetaAds - Generated Meta ads:", generatedAds);
      
      toast({
        title: "Instagram ads generated",
        description: `${generatedAds.length} ad variations created.`,
      });
      
      return generatedAds;
    } catch (error) {
      console.error("Error in useMetaAds.generateMetaAds:", error);
      toast({
        title: "Generation failed",
        description: "There was a problem connecting to the AI service.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    generateMetaAds,
    metaAds,
  };
};
