
import React from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis } from "@/hooks/useAudienceAnalysis";
import { useAdGeneration } from "@/hooks/adGeneration";
import { useCampaignCreation } from "@/hooks/campaignActions/useCampaignCreation";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";
import CampaignLayout from "./CampaignLayout";
import { useWebsiteAnalysisHandler } from "@/hooks/campaign/useWebsiteAnalysisHandler";
import { useAudienceAnalysisHandler } from "@/hooks/campaign/useAudienceAnalysisHandler";
import { useAdGenerationHandlers } from "@/hooks/campaign/useAdGenerationHandlers";
import { useImageGenerationHandler } from "@/hooks/campaign/useImageGenerationHandler";
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useNavigationHandlers } from "@/hooks/campaign/useNavigationHandlers";

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
    metaAds,
    setMetaAds,
    linkedInAds,
    setLinkedInAds,
    microsoftAds,
    setMicrosoftAds,
    setAudienceAnalysisResult
  } = useCampaign();

  const {
    analyzeWebsite,
    isAnalyzing,
    cacheInfo
  } = useWebsiteAnalysis();

  const {
    analyzeAudience,
    isAnalyzing: isAnalyzingAudience
  } = useAudienceAnalysis();

  const {
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    isGenerating
  } = useAdGeneration();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { createCampaign, isCreating } = useCampaignCreation(
    user,
    campaignData,
    googleAds,
    metaAds
  );

  // Using the extracted hooks
  const { handleWebsiteAnalysis } = useWebsiteAnalysisHandler(
    analyzeWebsite,
    setAnalysisResult,
    setCampaignData
  );

  const { handleAudienceAnalysis } = useAudienceAnalysisHandler(
    analyzeAudience,
    analysisResult,
    setAudienceAnalysisResult,
    setCampaignData
  );

  const {
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds
  } = useAdGenerationHandlers(
    analysisResult, 
    campaignData,
    setGoogleAds,
    setMetaAds,
    setLinkedInAds,
    setMicrosoftAds,
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds
  );

  const { 
    handleGenerateImage, 
    loadingImageIndex 
  } = useImageGenerationHandler(
    generateAdImage,
    metaAds,
    linkedInAds,
    setMetaAds,
    setLinkedInAds,
    campaignData
  );

  const {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  } = useAdUpdateHandlers(
    googleAds,
    metaAds,
    microsoftAds,
    linkedInAds,
    setGoogleAds,
    setMetaAds,
    setMicrosoftAds,
    setLinkedInAds
  );

  const { handleBack, handleNext } = useNavigationHandlers(
    setCurrentStep,
    setCampaignData
  );

  // This wrapper function is crucial for proper navigation
  const handleNextWrapper = (data?: any) => {
    // Call handleNext and return its result
    return handleNext(data);
  };

  const { getStepContent } = useCampaignStepRenderer({
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    microsoftAds,
    linkedInAds,
    isAnalyzing,
    isGenerating,
    loadingImageIndex,
    isCreating,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds,
    handleGenerateImage,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign,
    cacheInfo
  });

  return (
    <CampaignLayout
      onBack={handleBack}
      currentStep={currentStep}
    >
      {getStepContent()}
    </CampaignLayout>
  );
};

export default CampaignContent;
