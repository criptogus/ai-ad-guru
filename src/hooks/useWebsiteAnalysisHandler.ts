
import { useCallback } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface UseWebsiteAnalysisHandlerProps {
  handleAnalyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  setAnalysisResult: React.Dispatch<React.SetStateAction<WebsiteAnalysisResult | null>>;
}

export const useWebsiteAnalysisHandler = ({
  handleAnalyzeWebsite,
  setAnalysisResult
}: UseWebsiteAnalysisHandlerProps) => {
  
  const handleWebsiteAnalysis = useCallback(async (url: string): Promise<WebsiteAnalysisResult | null> => {
    try {
      const result = await handleAnalyzeWebsite(url);
      if (result) {
        setAnalysisResult(result);
      }
      return result;
    } catch (error) {
      console.error("Error during website analysis:", error);
      return null;
    }
  }, [handleAnalyzeWebsite, setAnalysisResult]);

  return {
    handleWebsiteAnalysis
  };
};
