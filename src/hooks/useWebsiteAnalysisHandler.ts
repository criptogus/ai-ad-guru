
import { useCallback } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useToast } from "@/hooks/use-toast";

interface UseWebsiteAnalysisHandlerProps {
  handleAnalyzeWebsite: (url: string) => Promise<WebsiteAnalysisResult | null>;
  setAnalysisResult: React.Dispatch<React.SetStateAction<WebsiteAnalysisResult | null>>;
}

export const useWebsiteAnalysisHandler = ({
  handleAnalyzeWebsite,
  setAnalysisResult
}: UseWebsiteAnalysisHandlerProps) => {
  const { toast } = useToast();
  
  const handleWebsiteAnalysis = useCallback(async (url: string): Promise<WebsiteAnalysisResult | null> => {
    try {
      if (!url.trim()) {
        toast({
          title: "Error",
          description: "Please enter a valid website URL",
          variant: "destructive",
        });
        return null;
      }
      
      // Format URL if needed
      let formattedUrl = url.trim();
      
      // Check if URL has a protocol, add https:// if missing
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        // Add https protocol - don't automatically add www prefix as it might interfere with subdomains
        formattedUrl = 'https://' + formattedUrl;
      }
      
      console.log("Analyzing website with formatted URL:", formattedUrl);
      
      toast({
        title: "Analyzing website",
        description: "Please wait while we analyze your website...",
      });
      
      const result = await handleAnalyzeWebsite(formattedUrl);
      
      if (result) {
        setAnalysisResult(result);
        toast({
          title: "Analysis complete",
          description: "Website analysis completed successfully",
        });
      } else {
        toast({
          title: "Analysis failed",
          description: "Unable to analyze website. Please try again with a different URL.",
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error: any) {
      console.error("Error during website analysis:", error);
      
      toast({
        title: "Analysis error",
        description: error.message || "An error occurred during website analysis",
        variant: "destructive",
      });
      
      return null;
    }
  }, [handleAnalyzeWebsite, setAnalysisResult, toast]);

  return {
    handleWebsiteAnalysis
  };
};
