
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface AudienceAnalysisHandlerProps {
  analyzeAudience: (analysisData: WebsiteAnalysisResult) => Promise<any>;
  analysisResult: WebsiteAnalysisResult | null;
  setAudienceAnalysisResult: (result: any) => void;
  setCampaignData: (data: any) => void;
}

export const useAudienceAnalysisHandler = ({
  analyzeAudience,
  analysisResult,
  setAudienceAnalysisResult,
  setCampaignData,
}: AudienceAnalysisHandlerProps) => {
  const handleAudienceAnalysis = async () => {
    if (!analysisResult) return null;
    
    try {
      const result = await analyzeAudience(analysisResult);
      if (result) {
        setAudienceAnalysisResult(result);
        
        // Update campaign data with audience information
        setCampaignData((prev: any) => ({
          ...prev,
          audienceAnalysis: result
        }));
        
        return result;
      }
    } catch (error) {
      console.error("Error analyzing audience:", error);
    }
    
    return null;
  };

  return { handleAudienceAnalysis };
};
