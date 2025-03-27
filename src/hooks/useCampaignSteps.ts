
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

  const handleNext = (data?: any) => {
    // Update data if provided but NEVER navigate automatically from data updates
    if (data) {
      // Explicitly return false to prevent any navigation attempts
      // EXCEPT for the platform selection step which needs special handling
      if (currentStep === 2) {
        // For platform selection, we WILL allow navigation to continue
        // This is handled in the handleNextWrapper in CampaignContent
        return false;
      }
      
      // For all other steps, strictly prevent navigation when updating data
      return false;
    }
    
    // Validate current step
    if (currentStep === 1 && !analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website before proceeding",
        variant: "destructive",
      });
      return false;
    }

    // Validate platform selection
    if (currentStep === 2) {
      if (!campaignData.platforms || campaignData.platforms.length === 0) {
        toast({
          title: "Platform Selection Required",
          description: "Please select at least one platform before proceeding",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate mind triggers selection
    if (currentStep === 3) {
      const platforms = campaignData.platforms || [];
      const mindTriggers = campaignData.mindTriggers || {};
      
      const missingTriggers = platforms.filter(platform => !mindTriggers[platform]);
      
      if (missingTriggers.length > 0) {
        toast({
          title: "Mind Triggers Required",
          description: `Please select mind triggers for ${missingTriggers.join(", ")}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate campaign setup
    if (currentStep === 4) {
      if (!campaignData.name || !campaignData.description) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
    }

    // Check if we have ads before proceeding to summary
    if (currentStep === 5) {
      const platforms = campaignData.platforms || [];
      
      let hasAds = false;
      
      if (platforms.includes('google') && campaignData.googleAds?.length > 0) {
        hasAds = true;
      } else if (platforms.includes('meta') && campaignData.metaAds?.length > 0) {
        hasAds = true;
      } else if (platforms.includes('linkedin') && campaignData.linkedInAds?.length > 0) {
        hasAds = true;
      } else if (platforms.includes('microsoft') && campaignData.microsoftAds?.length > 0) {
        hasAds = true;
      }
        
      if (!hasAds) {
        toast({
          title: "Ads Required",
          description: "Please generate ads for at least one selected platform before proceeding",
          variant: "destructive",
        });
        return false;
      }
    }

    // Only check credits on the final submit step (now step 6)
    if (currentStep === 6) {
      if (user && user.credits < 5) {
        toast({
          title: "Insufficient credits",
          description: "You need at least 5 credits to create a campaign",
          variant: "destructive",
        });
        return false;
      }
      
      return true; // Signal to create campaign
    }

    // Only advance to the next step when explicitly called with no data
    setCurrentStep(currentStep + 1);
    return false;
  };

  return {
    handleBack,
    handleNext,
  };
};
