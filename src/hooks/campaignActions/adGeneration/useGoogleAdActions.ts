
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getCreditCosts } from "@/services";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = getCreditCosts();

  // Generate Google Ads
  const handleGenerateGoogleAds = async (): Promise<void> => {
    if (!analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Show credit usage preview
      toast({
        title: "Credit Usage Preview",
        description: `This will use ${creditCosts.campaignCreation} credits to generate 5 Google ad variations`,
        duration: 5000,
      });

      const generatedAds = await generateGoogleAds({
        websiteUrl: analysisResult.websiteUrl,
        companyName: analysisResult.companyName,
        usps: analysisResult.uniqueSellingPoints,
        targetAudience: analysisResult.targetAudience,
        callToAction: analysisResult.callToAction,
        brandTone: analysisResult.brandTone,
        keywords: analysisResult.keywords,
      });

      if (generatedAds) {
        setCampaignData(prev => ({ ...prev, googleAds: generatedAds }));
        toast({
          title: "Google Ads Generated",
          description: `${generatedAds.length} ads were created successfully`,
        });
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        title: "Failed to Generate Google Ads",
        description: "There was an error generating your ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Update a specific Google Ad
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd): void => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setCampaignData(prev => ({ ...prev, googleAds: updatedAds }));
  };

  return {
    handleGenerateGoogleAds,
    handleUpdateGoogleAd,
    isGenerating
  };
};
