
import React, { useContext } from "react";
import { CampaignContext } from "@/contexts/CampaignContext";
import { useToast } from "@/hooks/use-toast";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";

const CampaignContent: React.FC = () => {
  const { toast } = useToast();
  const campaignContext = useContext(CampaignContext);
  
  if (!campaignContext) {
    return <div>Loading campaign...</div>;
  }
  
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
  } = campaignContext;

  const handleSetStep = (step: string) => {
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

  const stepRendererProps = {
    activeCampaignStep,
    setActiveCampaignStep,
    campaignData,
    setCampaignData,
    analysisResult,
    setAnalysisResult,
    handleSetStep,
    resetCampaign,
  };

  const { getStepContent } = useCampaignStepRenderer(stepRendererProps);

  return <div>{getStepContent()}</div>;
};

export default CampaignContent;
