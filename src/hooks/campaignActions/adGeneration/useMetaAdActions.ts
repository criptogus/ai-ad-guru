
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any, mindTrigger?: string) => Promise<MetaAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateMetaAds = async () => {
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
        description: "Creating Instagram/Meta ads based on your website analysis"
      });
      
      // Call the API with a simplified version of analysisResult
      const result = await generateMetaAds(analysisResult);
      
      if (result && result.length > 0) {
        // Update the campaign data with the generated ads
        setCampaignData((prev: any) => ({
          ...prev,
          metaAds: result
        }));
        
        toast({
          title: "Ads Generated",
          description: `Successfully created ${result.length} Instagram/Meta ads`
        });
      } else {
        throw new Error("No ads were generated");
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Instagram/Meta ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    handleGenerateMetaAds,
    isGenerating
  };
};
