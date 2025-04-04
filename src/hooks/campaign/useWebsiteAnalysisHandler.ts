
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export const useWebsiteAnalysisHandler = (
  analyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>,
  setAnalysisResult: (result: WebsiteAnalysisResult) => void,
  setCampaignData: (updater: (prev: any) => any) => void
) => {
  const handleWebsiteAnalysis = async (url: string) => {
    const result = await analyzeWebsite(url);
    if (result) {
      setAnalysisResult(result);
      
      setCampaignData(prev => ({
        ...prev,
        targetUrl: result.websiteUrl,
        targetAudience: result.targetAudience
      }));
    }
    return result;
  };

  return { handleWebsiteAnalysis };
};
