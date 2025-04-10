
import { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface UseGoogleAdActionsProps {
  analysisResult: WebsiteAnalysisResult | null;
  googleAds: GoogleAd[];
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useGoogleAdActions = ({
  analysisResult,
  googleAds,
  generateGoogleAds,
  setCampaignData
}: UseGoogleAdActionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateGoogleAds = async (mindTrigger?: string) => {
    if (!analysisResult) {
      console.error("Cannot generate Google Ads without website analysis data");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const newAds = await generateGoogleAds(analysisResult, mindTrigger);
      
      if (newAds && newAds.length > 0) {
        // Update campaign data with the new ads and existing data
        setCampaignData((prev: any) => ({
          ...prev,
          googleAds: newAds
        }));
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateGoogleAds,
    isGenerating
  };
};
