
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MicrosoftAd } from "@/contexts/CampaignContext";

export const useMicrosoftAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  microsoftAds: MicrosoftAd[],
  generateMicrosoftAds: (campaignData: any) => Promise<MicrosoftAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Missing information",
        description: "Please analyze a website first to generate Microsoft ads",
        variant: "destructive",
      });
      return null;
    }

    try {
      const newAds = await generateMicrosoftAds(analysisResult);
      
      if (newAds && newAds.length > 0) {
        // Update campaign data with new ads
        setCampaignData(prev => ({
          ...prev,
          microsoftAds: newAds
        }));

        toast({
          title: "Microsoft Ads Generated",
          description: `Successfully created ${newAds.length} Microsoft ad variations`,
        });

        return newAds;
      } else {
        throw new Error("No Microsoft ads were generated");
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      toast({
        title: "Microsoft Ad Generation Failed",
        description: "There was an error generating Microsoft ads. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    handleGenerateMicrosoftAds
  };
};
