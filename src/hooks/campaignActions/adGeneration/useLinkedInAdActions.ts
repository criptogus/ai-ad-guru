
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { LinkedInAd } from "@/contexts/CampaignContext";

export const useLinkedInAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  linkedInAds: LinkedInAd[],
  generateLinkedInAds: (campaignData: any, mindTrigger?: string) => Promise<LinkedInAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze a website before generating ads",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast({
        title: "Generating Ads",
        description: "Creating LinkedIn ads based on your website analysis"
      });
      
      // Get the campaign data from context
      const result = await generateLinkedInAds(analysisResult);
      
      if (result && result.length > 0) {
        // Update the campaign data with the generated ads
        setCampaignData((prev: any) => ({
          ...prev,
          linkedInAds: result
        }));
        
        toast({
          title: "Ads Generated",
          description: `Successfully created ${result.length} LinkedIn ads`
        });
      } else {
        throw new Error("No ads were generated");
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate LinkedIn ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateLinkedInAds,
    isGenerating
  };
};
