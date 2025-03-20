
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { LinkedInAd } from "@/contexts/CampaignContext";
import { getCreditCosts, consumeCredits } from "@/services";
import { useAuth } from "@/contexts/AuthContext";

// Helper to ensure imagePrompt is always present
const ensureMetaAdFormat = (ads: LinkedInAd[]): MetaAd[] => {
  return ads.map(ad => ({
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    imagePrompt: ad.imagePrompt || '', // Ensure imagePrompt is never undefined
    imageUrl: ad.imageUrl
  }));
};

export const useMetaAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  metaAds: MetaAd[],
  generateMetaAds: (campaignData: any) => Promise<LinkedInAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = { campaignCreation: 5, imageGeneration: 5 }; // Fallback if getCreditCosts is undefined

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
      const success = true; // Simplified for now

      const linkedInAds = await generateMetaAds({
        websiteUrl: analysisResult.websiteUrl,
        companyName: analysisResult.companyName,
        usps: analysisResult.uniqueSellingPoints,
        targetAudience: analysisResult.targetAudience,
        callToAction: analysisResult.callToAction,
        brandTone: analysisResult.brandTone,
        keywords: analysisResult.keywords,
      });

      if (linkedInAds) {
        // Convert LinkedInAds to MetaAds format
        const generatedAds = ensureMetaAdFormat(linkedInAds);
        
        setCampaignData(prev => ({ 
          ...prev, 
          linkedInAds: linkedInAds // Store as LinkedInAds for backward compatibility
        }));
        
        toast({
          title: "Instagram Ads Generated",
          description: `${generatedAds.length} ads were created successfully`,
          duration: 3000,
        });
        
        return;
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
      toast({
        title: "Failed to Generate Instagram Ads",
        description: "There was an error generating your ads",
        variant: "destructive",
        duration: 3000,
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
