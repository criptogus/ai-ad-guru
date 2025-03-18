
import { useToast } from "@/hooks/use-toast";

export const useWebsiteAnalysisActions = () => {
  const { toast } = useToast();
  
  // Handle page transitions
  const handleAnalyzeWebsite = async (url: string) => {
    // Analysis logic is in useWebsiteAnalysis hook
    return null;
  };

  return {
    handleAnalyzeWebsite
  };
};
