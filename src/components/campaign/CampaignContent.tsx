
import React from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { useToast } from "@/hooks/use-toast";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";
import { MetaAd } from "@/hooks/adGeneration/types";

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

  // Convert LinkedInAds to MetaAds format for compatibility
  const convertedMetaAds: MetaAd[] = linkedInAds.map(ad => ({
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    imagePrompt: ad.imagePrompt || '', // Ensure imagePrompt is never undefined
    imageUrl: ad.imageUrl
  }));

  // Mock data for rendering steps
  const mockStepRendererProps = {
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds: convertedMetaAds, // Use the properly converted MetaAds
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
