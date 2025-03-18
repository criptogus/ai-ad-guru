
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();

  // Generate Google ads
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze your website first",
        variant: "destructive",
      });
      return;
    }

    console.log("Generating Google ads with analysis result:", analysisResult);
    const ads = await generateGoogleAds(analysisResult);
    console.log("Generated Google ads:", ads);
    
    if (ads && ads.length > 0) {
      // Update campaign data with generated ads
      setCampaignData(prev => ({
        ...prev,
        googleAds: ads
      }));
      
      toast({
        title: "Google Ads Generated",
        description: `Successfully created ${ads.length} ad variations. The first ad will be used initially and automatically optimized based on performance.`,
      });
    } else {
      toast({
        title: "Ad Generation Failed",
        description: "Unable to generate Google ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleGenerateGoogleAds
  };
};
