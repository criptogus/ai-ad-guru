
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { getCreditCosts, consumeCredits } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = getCreditCosts();

  // Generate Meta Ads
  const handleGenerateMetaAds = async (): Promise<void> => {
    if (!analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate ads",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Show credit usage preview
      toast({
        title: "Credit Usage Preview",
        description: `This will use ${creditCosts.campaignCreation} credits to generate Instagram ad variations. Image generation costs ${creditCosts.imageGeneration} credits per image.`,
        duration: 3000,
      });

      // Consume credits before generating the ads
      const creditSuccess = await consumeCredits(
        user.id,
        creditCosts.campaignCreation,
        'campaign_creation',
        'Instagram ad generation'
      );
      
      if (!creditSuccess) {
        toast({
          title: "Insufficient Credits",
          description: "You don't have enough credits to generate these ads",
          variant: "destructive",
          duration: 3000,
        });
        setIsGenerating(false);
        return;
      }

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
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        title: "Failed to Generate Instagram Ads",
        description: "There was an error generating your ads",
        variant: "destructive",
        duration: 3000,
      });
      
      // Refund credits on failure
      if (user) {
        await consumeCredits(
          user.id,
          -creditCosts.campaignCreation, // Negative amount to refund
          'credit_refund',
          'Refund for failed ad generation'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Update a specific Meta Ad
  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd): void => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setCampaignData(prev => ({ ...prev, metaAds: updatedAds }));
    
    toast({
      title: "Ad Updated",
      description: "Your Instagram ad has been updated successfully",
      duration: 3000,
    });
  };

  return {
    handleGenerateMetaAds,
    handleUpdateMetaAd,
    isGenerating
  };
};
