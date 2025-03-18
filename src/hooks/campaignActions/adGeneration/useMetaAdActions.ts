
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  
  // Generate Meta ads
  const handleGenerateMetaAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze your website first",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating Meta ads with analysis result:", analysisResult);
    const ads = await generateMetaAds(analysisResult);
    console.log("Generated Meta ads:", ads);
    
    if (ads && ads.length > 0) {
      // Update campaign data with generated ads
      setCampaignData(prev => ({
        ...prev,
        metaAds: ads
      }));
      
      toast({
        title: "Meta Ads Generated",
        description: `Successfully created ${ads.length} ad variations. Generating images will make them more effective.`,
      });
    } else {
      toast({
        title: "Ad Generation Failed",
        description: "Unable to generate Meta ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleGenerateMetaAds
  };
};
