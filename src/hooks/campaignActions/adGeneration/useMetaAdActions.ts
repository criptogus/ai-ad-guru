
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getCreditCosts } from "@/services";

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = getCreditCosts();

  // Generate Meta Ads
  const handleGenerateMetaAds = async (): Promise<void> => {
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
        description: `This will use ${creditCosts.campaignCreation} credits to generate Instagram ad variations. Image generation costs ${creditCosts.imageGeneration} credits per image.`,
        duration: 5000,
      });

      const generatedAds = await generateMetaAds({
        websiteUrl: analysisResult.websiteUrl,
        companyName: analysisResult.companyName,
        usps: analysisResult.uniqueSellingPoints,
        targetAudience: analysisResult.targetAudience,
        callToAction: analysisResult.callToAction,
        brandTone: analysisResult.brandTone,
        keywords: analysisResult.keywords,
      });

      if (generatedAds) {
        setCampaignData(prev => ({ ...prev, metaAds: generatedAds }));
        toast({
          title: "Instagram Ads Generated",
          description: `${generatedAds.length} ads were created successfully`,
        });
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        title: "Failed to Generate Instagram Ads",
        description: "There was an error generating your ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Update a specific Meta Ad
  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd): void => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setCampaignData(prev => ({ ...prev, metaAds: updatedAds }));
  };

  return {
    handleGenerateMetaAds,
    handleUpdateMetaAd,
    isGenerating
  };
};
