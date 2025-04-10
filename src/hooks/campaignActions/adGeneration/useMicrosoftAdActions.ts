
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface UseMicrosoftAdActionsProps {
  analysisResult: WebsiteAnalysisResult | null;
  microsoftAds: any[];
  generateMicrosoftAds: (campaignData: any, mindTrigger?: string) => Promise<any[] | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useMicrosoftAdActions = ({
  analysisResult,
  microsoftAds,
  generateMicrosoftAds,
  setCampaignData
}: UseMicrosoftAdActionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateMicrosoftAds = async (mindTrigger?: string) => {
    if (!analysisResult) {
      console.error("Cannot generate Microsoft Ads without website analysis data");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const newAds = await generateMicrosoftAds(analysisResult, mindTrigger);
      
      if (newAds && newAds.length > 0) {
        // Update campaign data with the new ads
        setCampaignData((prev: any) => ({
          ...prev,
          microsoftAds: newAds
        }));
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateMicrosoftAds,
    isGenerating
  };
};
