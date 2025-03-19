
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { LinkedInAd } from "@/contexts/CampaignContext";

export const useLinkedInAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  linkedInAds: LinkedInAd[],
  generateLinkedInAds: (campaignData: any) => Promise<LinkedInAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();

  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Missing information",
        description: "Please analyze a website first to generate LinkedIn ads",
        variant: "destructive",
      });
      return null;
    }

    try {
      const newAds = await generateLinkedInAds(analysisResult);
      
      if (newAds && newAds.length > 0) {
        // Update campaign data with new ads
        setCampaignData(prev => ({
          ...prev,
          linkedInAds: newAds
        }));

        toast({
          title: "LinkedIn Ads Generated",
          description: `Successfully created ${newAds.length} LinkedIn ad variations`,
        });

        return newAds;
      } else {
        throw new Error("No LinkedIn ads were generated");
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
      toast({
        title: "LinkedIn Ad Generation Failed",
        description: "There was an error generating LinkedIn ads. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    handleGenerateLinkedInAds
  };
};
