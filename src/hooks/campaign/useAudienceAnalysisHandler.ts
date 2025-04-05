
import { AudienceAnalysisResult } from "@/hooks/useAudienceAnalysis";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface UseAudienceAnalysisHandlerProps {
  analyzeAudience: (input: any) => Promise<AudienceAnalysisResult | null>;
  analysisResult: WebsiteAnalysisResult | null;
  setAudienceAnalysisResult: React.Dispatch<React.SetStateAction<AudienceAnalysisResult | null>>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useAudienceAnalysisHandler = ({
  analyzeAudience,
  analysisResult,
  setAudienceAnalysisResult,
  setCampaignData
}: UseAudienceAnalysisHandlerProps) => {
  const handleAudienceAnalysis = async () => {
    if (!analysisResult) return null;
    
    try {
      const result = await analyzeAudience({
        companyName: analysisResult.companyName,
        businessDescription: analysisResult.businessDescription,
        targetAudience: analysisResult.targetAudience,
        uniqueSellingPoints: analysisResult.uniqueSellingPoints,
        callToAction: analysisResult.callToAction,
        websiteUrl: analysisResult.websiteUrl,
      });
      
      if (result) {
        setAudienceAnalysisResult(result);
        
        // Update campaign data with audience information
        setCampaignData((prev: any) => ({
          ...prev,
          audienceAnalysis: result
        }));
      }
      
      return result;
    } catch (error) {
      console.error("Error analyzing audience:", error);
      return null;
    }
  };

  return {
    handleAudienceAnalysis
  };
};
