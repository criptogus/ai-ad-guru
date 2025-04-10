
import { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface UseMetaAdActionsProps {
  analysisResult: WebsiteAnalysisResult | null;
  linkedInAds: MetaAd[];
  generateLinkedInAds: (campaignData: any, mindTrigger?: string) => Promise<MetaAd[] | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useMetaAdActions = ({
  analysisResult,
  linkedInAds,
  generateLinkedInAds,
  setCampaignData
}: UseMetaAdActionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateMetaAds = async (mindTrigger?: string) => {
    if (!analysisResult) {
      console.error("Cannot generate Meta Ads without website analysis data");
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
    handleGenerateMetaAds,
    isGenerating
  };
};
