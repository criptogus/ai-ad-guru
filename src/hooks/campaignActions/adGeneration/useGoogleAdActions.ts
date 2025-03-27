
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { toast } from "sonner";
import { errorLogger } from "@/services/libs/error-handling";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast("Website analysis required", {
        description: "Please analyze a website before generating ads"
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

      toast("Google Ads Generated", {
        description: `${ads.length} ad variations created. 5 credits used.`
      });

    } catch (error) {
      errorLogger.logError(error, "handleGenerateGoogleAds");
      console.error("Error generating Google ads:", error);
      toast("Ad Generation Failed", {
        description: error instanceof Error ? error.message : "Failed to generate Google Ads. Please check network connection and try again."
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
