
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MicrosoftAd } from "@/contexts/CampaignContext";

export const useMicrosoftAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  microsoftAds: MicrosoftAd[],
  generateMicrosoftAds: (campaignData: any, mindTrigger?: string) => Promise<MicrosoftAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateMicrosoftAds = async () => {
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
        description: "Creating Microsoft ads based on your website analysis"
      });
      
      // Get the campaign data from context
      const result = await generateMicrosoftAds(analysisResult);
      
      if (result && result.length > 0) {
        // Update the campaign data with the generated ads
        setCampaignData((prev: any) => ({
          ...prev,
          microsoftAds: result
        }));
        
        toast({
          title: "Ads Generated",
          description: `Successfully created ${result.length} Microsoft ads`
        });
      } else {
        throw new Error("No ads were generated");
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Microsoft ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateMicrosoftAds,
    isGenerating
  };
};
