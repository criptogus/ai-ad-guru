
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
      // Format URL if needed
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        // If the URL doesn't start with www, add it
        if (!formattedUrl.startsWith('www.')) {
          formattedUrl = 'www.' + formattedUrl;
        }
        // Add https protocol
        formattedUrl = 'https://' + formattedUrl;
      }
      
      console.log("Analyzing website with formatted URL:", formattedUrl);
      
      const result = await handleAnalyzeWebsite(formattedUrl);
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
