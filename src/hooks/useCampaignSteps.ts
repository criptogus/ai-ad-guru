
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { CampaignData } from "@/contexts/CampaignContext";

export const useCampaignSteps = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  analysisResult: WebsiteAnalysisResult | null,
  campaignData: CampaignData,
  user: any
) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && !analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2) {
      if (!campaignData.name || !campaignData.description) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }

    // Check if we have ads before proceeding to summary
    if (currentStep === 3) {
      const platform = campaignData.platform;
      let platformAds;
      
      if (platform === 'google') {
        platformAds = campaignData.googleAds;
      } else if (platform === 'linkedin') {
        platformAds = campaignData.linkedInAds;
      } else if (platform === 'microsoft') {
        platformAds = campaignData.microsoftAds;
      }
        
      if (!platformAds || platformAds.length === 0) {
        toast({
          title: "Ads Required",
          description: `Please generate ${platform} ads before proceeding`,
          variant: "destructive",
        });
        return;
      }
    }

    // Only check credits on the final submit step (now step 4)
    if (currentStep === 4) {
      if (user && user.credits < 5) {
        toast({
          title: "Insufficient credits",
          description: "You need at least 5 credits to create a campaign",
          variant: "destructive",
        });
        return;
      }
      
      return true; // Signal to create campaign
    }

    setCurrentStep(currentStep + 1);
    return false;
  };

  return {
    handleBack,
    handleNext,
  };
};
