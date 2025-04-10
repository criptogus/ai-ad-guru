
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration/types";

interface UseLinkedInAdActionsProps {
  analysisResult: WebsiteAnalysisResult | null;
  linkedInAds: MetaAd[];
  generateLinkedInAds: (campaignData: any, mindTrigger?: string) => Promise<MetaAd[] | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useLinkedInAdActions = ({
  analysisResult,
  linkedInAds,
  generateLinkedInAds,
  setCampaignData
}: UseLinkedInAdActionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateLinkedInAds = async (mindTrigger?: string) => {
    if (!analysisResult) {
      console.error("Cannot generate LinkedIn Ads without website analysis data");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const newAds = await generateLinkedInAds(analysisResult, mindTrigger);
      
      if (newAds && newAds.length > 0) {
        // Update campaign data with the new ads
        setCampaignData((prev: any) => ({
          ...prev,
          linkedInAds: newAds
        }));
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateLinkedInAds,
    isGenerating
  };
};
