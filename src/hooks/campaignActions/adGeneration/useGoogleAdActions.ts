
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>, 
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateGoogleAds = async () => {
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
        description: "Creating Google search ads based on your website analysis"
      });
      
      // Get the campaign data from context
      const result = await generateGoogleAds(analysisResult);
      
      if (result && result.length > 0) {
        // Update the campaign data with the generated ads
        setCampaignData((prev: any) => ({
          ...prev,
          googleAds: result
        }));
        
        toast({
          title: "Ads Generated",
          description: `Successfully created ${result.length} Google search ads`
        });
      } else {
        throw new Error("No ads were generated");
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Google ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateGoogleAds,
    isGenerating
  };
};
