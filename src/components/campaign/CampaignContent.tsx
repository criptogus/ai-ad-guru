import React, { useState, useEffect } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { useAuth } from "@/hooks/useAuthState";
import { useCampaignActions } from "@/hooks/campaignActions";
import CampaignHeader from "./CampaignHeader";
import StepIndicator from "./StepIndicator";
import StepNavigation from "./StepNavigation";
import { InstaAdTestLink } from "@/components/testing/meta";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";

const CampaignContent: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
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
    metaAds,
    setMetaAds
  } = useCampaign();

  const { user } = useAuth();
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const { generateGoogleAds, generateLinkedInAds, generateMicrosoftAds, generateAdImage } = useAdGeneration();

  const {
    handleAnalyzeWebsite,
    isAnalyzing,
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    imageGenerationError,
    clearImageGenerationError,
    createCampaign,
    isCreating
  } = useCampaignActions(
    user,
    campaignData,
    analysisResult,
    googleAds,
    linkedInAds,
    microsoftAds,
    generateGoogleAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    setCampaignData
  );

  const handleUpdateGoogleAd = (index: number, updatedAd: any) => {
    const newAds = [...googleAds];
    newAds[index] = updatedAd;
    setGoogleAds(newAds);
  };

  const handleUpdateMetaAd = (index: number, updatedAd: any) => {
    const newAds = [...metaAds];
    newAds[index] = updatedAd;
    setMetaAds(newAds);
  };

  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    const newAds = [...microsoftAds];
    newAds[index] = updatedAd;
    setMicrosoftAds(newAds);
  };

  const handleWebsiteAnalysis = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    try {
      const result = await handleAnalyzeWebsite(url);
      setAnalysisResult(result);
      return result;
    } catch (error) {
      console.error("Error during website analysis:", error);
      return null;
    }
  };

  const handleGenerateImageForAd = async (ad: MetaAd, index: number) => {
    try {
      setLoadingImageIndex(index);
      setIsGenerating(true);
      await handleGenerateImage(ad.imagePrompt, { platform: campaignData.platform });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoadingImageIndex(null);
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNextWrapper = (data?: any) => {
    if (data) {
      setCampaignData({ ...campaignData, ...data });
    }
    handleNext();
  };

  const { getStepContent } = useCampaignStepRenderer({
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    microsoftAds,
    isAnalyzing,
    isGenerating,
    loadingImageIndex,
    isCreating,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage: handleGenerateImageForAd,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <CampaignHeader currentStep={currentStep} />
        <InstaAdTestLink />
      </div>
      
      <StepIndicator currentStep={currentStep} />
      
      <div className="bg-white rounded-lg border p-6">
        {getStepContent()}
      </div>
      
      <StepNavigation
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={isCreating}
      />
    </div>
  );
};

export default CampaignContent;
