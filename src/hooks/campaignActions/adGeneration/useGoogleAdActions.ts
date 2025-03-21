
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";
import { getCreditCosts } from "@/services/credits/creditCosts";
import { checkUserCredits, deductUserCredits } from "@/services/credits/creditChecks";
import { OptimizedGoogleAd } from "@/services/api/optimizerApi";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const creditCosts = getCreditCosts();

  const handleGenerateGoogleAds = async (): Promise<void> => {
    if (!analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please complete website analysis before generating ads.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough credits
    const hasCredits = await checkUserCredits(creditCosts.campaignCreation);
    
    if (!hasCredits) {
      toast({
        title: "Not Enough Credits",
        description: `You need ${creditCosts.campaignCreation} credits to generate ads. Please purchase more credits.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const newGoogleAds = await generateGoogleAds(analysisResult);
      
      if (newGoogleAds) {
        // Deduct credits only on successful generation
        await deductUserCredits(
          creditCosts.campaignCreation,
          'campaign_creation',
          `Generated ${newGoogleAds.length} Google text ads`
        );
        
        console.log(`Generated ${newGoogleAds.length} Google ads`);
        
        // Update the campaign data with the generated ads
        setCampaignData((prev: any) => ({
          ...prev,
          googleAds: newGoogleAds
        }));
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleApplyOptimization = (adIndex: number, optimizedAd: OptimizedGoogleAd): void => {
    if (adIndex < 0 || adIndex >= googleAds.length) {
      console.error("Invalid ad index for optimization:", adIndex);
      return;
    }

    // Create a new ad object with the optimized values
    const updatedAd: GoogleAd = {
      ...googleAds[adIndex],
      headlines: optimizedAd.headlines,
      descriptions: optimizedAd.descriptions
    };

    // Update the ad at the specified index
    const updatedAds = [...googleAds];
    updatedAds[adIndex] = updatedAd;

    // Update the campaign data with the optimized ad
    setCampaignData((prev: any) => ({
      ...prev,
      googleAds: updatedAds
    }));

    toast({
      title: "Optimization Applied",
      description: "The ad has been updated with the optimized content."
    });
  };

  return {
    handleGenerateGoogleAds,
    handleApplyOptimization
  };
};
