
import React, { useContext } from "react";
import { CampaignStep } from "@/hooks/useCampaignFlow";
import { CampaignContext } from "@/contexts/CampaignContext";
import { useToast } from "@/hooks/use-toast";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";

const CampaignContent: React.FC = () => {
  const { toast } = useToast();
  const {
    activeCampaignStep,
    setActiveCampaignStep,
    campaignData,
    setCampaignData,
    analysisResult,
    setAnalysisResult,
    googleAds,
    setGoogleAds,
    linkedInAds,
    setLinkedInAds,
    microsoftAds,
    setMicrosoftAds,
    resetCampaign,
    isRequiredStep,
  } = useContext(CampaignContext);

  const handleSetStep = (step: CampaignStep) => {
    if (!isRequiredStep(step)) {
      setActiveCampaignStep(step);
    } else {
      toast({
        title: "Complete required steps first",
        description: "Please complete all required steps before proceeding",
        variant: "destructive",
      });
    }
  };

  const { renderActiveStep } = useCampaignStepRenderer({
    activeCampaignStep,
    setActiveCampaignStep,
    campaignData,
    setCampaignData,
    analysisResult,
    setAnalysisResult,
    handleSetStep,
    resetCampaign,
  });

  return <div>{renderActiveStep()}</div>;
};

export default CampaignContent;
