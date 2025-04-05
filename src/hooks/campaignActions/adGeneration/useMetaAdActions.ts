
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import { toast } from "sonner";
import { errorLogger } from "@/services/libs/error-handling";

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any, mindTrigger?: string) => Promise<MetaAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) {
      toast("Website analysis required", {
        description: "Please analyze a website before generating ads"
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Get the mind trigger from the campaign data
      const mindTrigger = (window as any).campaignContext?.campaignData?.mindTriggers?.meta || "";
      
      console.log("Generating Meta ads with mind trigger:", mindTrigger);
      
      // Attempt to generate ads through the API
      let ads = await generateMetaAds(analysisResult, mindTrigger);
      
      if (!ads || ads.length === 0) {
        // Generate fallback ads if API fails
        console.log("Using fallback Meta ads");
        ads = generateFallbackMetaAds(analysisResult);
      }

      // Update campaign data with the generated ads
      setCampaignData((prev: any) => ({
        ...prev,
        metaAds: ads,
      }));

      toast("Instagram Ads Generated", {
        description: `${ads.length} ad variations created. 5 credits used.`
      });

    } catch (error) {
      errorLogger.logError(error, "handleGenerateMetaAds");
      console.error("Error generating Meta ads:", error);
      
      // Generate fallback ads if there was an error
      const fallbackAds = generateFallbackMetaAds(analysisResult);
      
      setCampaignData((prev: any) => ({
        ...prev,
        metaAds: fallbackAds,
      }));
      
      toast("Used fallback ads", {
        description: "Generated fallback Instagram ads due to connection issues"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate fallback Meta ads
  const generateFallbackMetaAds = (analysisResult: WebsiteAnalysisResult | null): MetaAd[] => {
    if (!analysisResult) return [];
    
    const { companyName, businessDescription, callToAction, uniqueSellingPoints } = analysisResult;
    const sellingPoint = uniqueSellingPoints && uniqueSellingPoints.length > 0 
      ? uniqueSellingPoints[0] 
      : "Quality service you can trust";
    
    // Create 3 ad variations with the available data
    return [
      {
        headline: `Transform with ${companyName}`,
        primaryText: businessDescription || `Discover how ${companyName} can transform your experience with our professional services.`,
        description: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Learn More",
        imagePrompt: `Professional photo representing ${businessDescription?.substring(0, 100)}`
      },
      {
        headline: `Experience ${companyName}`,
        primaryText: `${sellingPoint}. ${businessDescription?.substring(0, 100) || `At ${companyName}, we deliver exceptional results.`}`,
        description: typeof callToAction === 'string' ? callToAction : callToAction?.[1] || "Explore Now",
        imagePrompt: `Creative branded image for ${companyName}`
      },
      {
        headline: `${companyName} - Your Solution`,
        primaryText: businessDescription || `Looking for the best? ${companyName} delivers results that exceed expectations every time.`,
        description: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Contact Us",
        imagePrompt: `Professional ${companyName} service image`
      }
    ];
  };

  return {
    handleGenerateMetaAds,
    isGenerating,
  };
};
