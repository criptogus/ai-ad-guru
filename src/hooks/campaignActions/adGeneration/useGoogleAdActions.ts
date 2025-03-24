
import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";
import { toast as sonerToast } from 'sonner';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = getCreditCosts();
  
  const handleGenerateGoogleAds = async () => {
    if (isGenerating) return;
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

    // Get the cost for Google ad generation
    const googleAdCost = creditCosts.googleAdGeneration || 5; // Fallback to 5 credits
    
    const hasCredits = await checkUserCredits(user.id, googleAdCost);
    
    if (!hasCredits) {
      sonerToast.error("Insufficient Credits", {
        description: `You need ${googleAdCost} credits to generate Google ads`,
        duration: 5000,
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Show credit usage preview
      sonerToast.info("Credit Usage Preview", {
        description: `This will use ${googleAdCost} credits to generate Google ad suggestions`,
        duration: 3000,
      });
      
      const generatedAds = await generateGoogleAds(analysisResult);
      
      if (generatedAds && generatedAds.length > 0) {
        // Deduct credits only if ads were successfully generated
        const creditSuccess = await deductUserCredits(
          user.id, 
          googleAdCost,
          'google_ad_generation', // More specific action type
          `Generated ${generatedAds.length} Google ads`
        );
        
        if (!creditSuccess) {
          console.error("Failed to deduct credits but ads were generated");
        }
        
        setCampaignData((prevData: any) => ({
          ...prevData,
          googleAds: generatedAds
        }));
        
        sonerToast.success("Google Ads Generated", {
          description: `Successfully generated ${generatedAds.length} Google ads using ${googleAdCost} credits`,
          duration: 3000,
        });
      } else {
        sonerToast.error("Generation Failed", {
          description: "Failed to generate Google ads. Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Google ads. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateGoogleAds,
    isGenerating
  };
};
