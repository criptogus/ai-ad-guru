
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export const useAudienceAnalysisHandler = (
  analyzeAudience: (analysisResult: WebsiteAnalysisResult, platform?: string) => Promise<any>,
  analysisResult: WebsiteAnalysisResult | null,
  setAudienceAnalysisResult: (result: any) => void,
  setCampaignData: (updater: (prev: any) => any) => void
) => {
  const handleAudienceAnalysis = async (platform?: string) => {
    if (!analysisResult) return;
    
    const result = await analyzeAudience(analysisResult, platform);
    if (result) {
      setAudienceAnalysisResult(result);
      
      setCampaignData(prev => ({
        ...prev,
        audienceAnalysis: result
      }));
    }
  };

  return { handleAudienceAnalysis };
};
