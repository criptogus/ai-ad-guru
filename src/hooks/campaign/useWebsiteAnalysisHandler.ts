
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface WebsiteAnalysisHandlerProps {
  handleAnalyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  setAnalysisResult: (result: WebsiteAnalysisResult) => void;
}

export const useWebsiteAnalysisHandler = ({
  handleAnalyzeWebsite,
  setAnalysisResult,
}: WebsiteAnalysisHandlerProps) => {
  const handleWebsiteAnalysis = async (url: string) => {
    try {
      const result = await handleAnalyzeWebsite(url);
      if (result) {
        setAnalysisResult(result);
        return result;
      }
    } catch (error) {
      console.error("Error analyzing website:", error);
    }
    return null;
  };

  return { handleWebsiteAnalysis };
};
