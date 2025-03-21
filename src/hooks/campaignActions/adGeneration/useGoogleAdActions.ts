
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";
import { checkUserCredits, deductUserCredits } from "@/services/credits/creditChecks";
import { getCreditCosts } from "@/services/credits/creditCosts";
import { useAuth } from "@/contexts/AuthContext";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const creditCosts = getCreditCosts();
  
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website before generating ads",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough credits
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate ads",
        variant: "destructive",
      });
      return;
    }

    const hasCredits = await checkUserCredits(user.id, creditCosts.adGeneration.google);
    
    if (!hasCredits) {
      toast({
        title: "Not Enough Credits",
        description: `You need ${creditCosts.adGeneration.google} credits to generate Google ads`,
        variant: "destructive",
      });
      return;
    }

    try {
      const generatedAds = await generateGoogleAds(analysisResult);
      
      if (generatedAds && generatedAds.length > 0) {
        // Deduct credits only if ads were successfully generated
        await deductUserCredits(
          user.id, 
          creditCosts.adGeneration.google,
          'google_ad_generation', 
          `Generated ${generatedAds.length} Google ads`
        );
        
        setCampaignData((prevData: any) => ({
          ...prevData,
          googleAds: generatedAds
        }));
        
        toast({
          title: "Ads Generated",
          description: `Successfully generated ${generatedAds.length} Google ads`,
        });
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Google ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    handleGenerateGoogleAds
  };
};
