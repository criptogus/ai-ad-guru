
import React from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaignActions } from "@/hooks/campaignActions";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";
import { useWebsiteAnalysisHandler } from "@/hooks/useWebsiteAnalysisHandler";
import { useImageGenerationHandler } from "@/hooks/useImageGenerationHandler";
import { useAdGenerationWrappers } from "@/hooks/useAdGenerationWrappers";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useAdUpdateHandlers } from "@/hooks/useAdUpdateHandlers";
import StepIndicator from "./StepIndicator";
import StepNavigation from "./StepNavigation";
import CampaignContentHeader from "./content/CampaignContentHeader";

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

  const { 
    generateGoogleAds, 
    generateMetaAds, 
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage 
  } = useAdGeneration();

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

  const { handleWebsiteAnalysis } = useWebsiteAnalysisHandler({
    handleAnalyzeWebsite,
    setAnalysisResult
  });

  const { handleUpdateGoogleAd, handleUpdateMetaAd, handleUpdateMicrosoftAd } = useAdUpdateHandlers({
    setGoogleAds,
    setMetaAds,
    setMicrosoftAds
  });

  const { handleBack, handleNextWrapper } = useStepNavigation({
    currentStep,
    setCurrentStep,
    setCampaignData,
    campaignData
  });

  const { loadingImageIndex, isGenerating, handleGenerateImageForAd } = useImageGenerationHandler({
    handleGenerateImage
  });

  // Ensure all ad generation wrappers have Promise<void> return type
  const { 
    wrappedHandleGenerateGoogleAds,
    wrappedHandleGenerateMetaAds,
    wrappedHandleGenerateMicrosoftAds
  } = useAdGenerationWrappers({
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds
  });

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
    handleGenerateGoogleAds: wrappedHandleGenerateGoogleAds,
    handleGenerateMetaAds: wrappedHandleGenerateMetaAds,
    handleGenerateMicrosoftAds: wrappedHandleGenerateMicrosoftAds,
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
      <CampaignContentHeader onBack={handleBack} currentStep={currentStep} />
      
      <StepIndicator 
        number={currentStep} 
        title={`Step ${currentStep}`} 
        active={true} 
        completed={false} 
      />
      
      <div className="bg-white rounded-lg border p-6">
        {getStepContent()}
      </div>
      
      <StepNavigation
        current={currentStep}
        currentStep={currentStep}
        total={5}
        totalSteps={5}
        onBack={handleBack}
        onNext={handleNextWrapper}
        isNextDisabled={isCreating}
      />
    </div>
  );
};

export default CampaignContent;
