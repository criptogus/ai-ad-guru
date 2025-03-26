
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { toast as sonerToast } from 'sonner';
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MicrosoftAd } from "@/contexts/CampaignContext";
import { checkUserCredits, deductUserCredits } from "@/services/credits/creditChecks";
import { getCreditCosts } from "@/services/credits/creditCosts";
import { useAuth } from "@/contexts/AuthContext";

export const useMicrosoftAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  microsoftAds: MicrosoftAd[],
  generateMicrosoftAds: (campaignData: any) => Promise<MicrosoftAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const creditCosts = getCreditCosts();

  const handleGenerateMicrosoftAds = async (): Promise<void> => {
    if (isGenerating) return;
    if (!analysisResult) {
      toast({
        title: "Analysis Required",
        description: "Please analyze a website first before generating ads",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to generate ads",
        variant: "destructive",
      });
      return;
    }

    // Check if user has enough credits
    const microsoftAdCost = creditCosts.microsoftAdGeneration || 5; // Fallback to 5 if not defined
    const hasCredits = await checkUserCredits(user.id, microsoftAdCost);
    
    if (!hasCredits) {
      sonerToast.error("Insufficient Credits", {
        description: `You need ${microsoftAdCost} credits to generate Microsoft ads`,
        duration: 5000,
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Show credit usage preview
      sonerToast.info("Credit Usage Preview", {
        description: `This will use ${microsoftAdCost} credits to generate Microsoft ad suggestions`,
        duration: 3000,
      });
      
      console.log("Generating Microsoft ads with analysis result:", analysisResult);
      const generatedAds = await generateMicrosoftAds(analysisResult);
      
      if (generatedAds && generatedAds.length > 0) {
        // Actually consume credits after successful generation
        const creditSuccess = await deductUserCredits(
          user.id,
          microsoftAdCost,
          'microsoft_ad_generation',
          'Microsoft ad generation'
        );
        
        if (!creditSuccess) {
          console.error("Failed to deduct credits but ads were generated");
        }
        
        // Update campaign data with the generated Microsoft ads
        setCampaignData(prev => ({
          ...prev,
          microsoftAds: generatedAds
        }));
        
        sonerToast.success("Microsoft Ads Generated", {
          description: `${generatedAds.length} ads created using ${microsoftAdCost} credits`,
          duration: 3000,
        });
      } else {
        sonerToast.error("Generation Failed", {
          description: "Failed to generate Microsoft ads. Please try again.",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating Microsoft ads",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleGenerateMicrosoftAds,
    isGenerating
  };
};
