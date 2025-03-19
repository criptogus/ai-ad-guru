
import React from "react";
import { useCampaign, CampaignContext } from "@/contexts/CampaignContext";
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
    currentStep
  } = useCampaign();

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

  // Mock data for rendering steps
  const mockStepRendererProps = {
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds: linkedInAds, // Use linkedInAds as metaAds for compatibility
    isAnalyzing: false,
    isGenerating: false,
    loadingImageIndex: null,
    isCreating: false,
    handleWebsiteAnalysis: async () => null,
    handleGenerateGoogleAds: async () => {},
    handleGenerateMetaAds: async () => {},
    handleGenerateImage: async () => {},
    handleUpdateGoogleAd: () => {},
    handleUpdateMetaAd: () => {},
    setCampaignData,
    handleBack: () => {},
    handleNextWrapper: () => {},
    createCampaign: async () => {}
  };

  const { getStepContent } = useCampaignStepRenderer(mockStepRendererProps);

  return <div>{getStepContent()}</div>;
};

export default CampaignContent;
