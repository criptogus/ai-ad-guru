
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Website analysis required",
        description: "Please analyze a website before generating ads",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Get the mind trigger from the campaign data
      const mindTrigger = (window as any).campaignContext?.campaignData?.mindTriggers?.google || "";
      
      console.log("Generating Google ads with mind trigger:", mindTrigger);
      const ads = await generateGoogleAds(analysisResult, mindTrigger);

      if (!ads || ads.length === 0) {
        throw new Error("Failed to generate Google ads");
      }

      // Update campaign data with the generated ads
      setCampaignData((prev: any) => ({
        ...prev,
        googleAds: ads,
      }));

      toast({
        title: "Google Ads Generated",
        description: `${ads.length} ad variations created`,
      });

    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Google Ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateGoogleAds,
    isGenerating,
  };
};
