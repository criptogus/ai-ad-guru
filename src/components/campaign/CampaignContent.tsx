
import React, { useState, useEffect } from "react";
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
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useNavigationHandlers } from "@/hooks/campaign/useNavigationHandlers";
import { useAdGenerationWrappers } from "@/hooks/useAdGenerationWrappers";
import { MetaAd } from "@/hooks/adGeneration/types";
import { useImageGenerationHandler } from "@/hooks/campaign/useImageGenerationHandler";
import { toast } from "sonner";

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

  useEffect(() => {
    console.log("CampaignContent: Current step is", currentStep);
    console.log("CampaignContent: Campaign data", campaignData);
  }, [currentStep, campaignData]);

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

  const {
    wrappedGenerateGoogleAds,
    wrappedGenerateMetaAds,
    wrappedGenerateLinkedInAds,
    wrappedGenerateMicrosoftAds
  } = useAdGenerationWrappers(
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds
  );

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { createCampaign, isCreating } = useCampaignCreation(
    user,
    campaignData,
    googleAds,
    metaAds
  );

  const { handleWebsiteAnalysis } = useWebsiteAnalysisHandler({
    handleAnalyzeWebsite: analyzeWebsite,
    setAnalysisResult,
  });

  const { handleAudienceAnalysis } = useAudienceAnalysisHandler({
    analyzeAudience,
    analysisResult,
    setAudienceAnalysisResult,
    setCampaignData,
  });

  const {
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds
  } = useAdGenerationHandlers({
    analysisResult,
    campaignData,
    setGoogleAds,
    setMetaAds,
    setLinkedInAds,
    setMicrosoftAds,
    generateGoogleAds: wrappedGenerateGoogleAds,
    generateMetaAds: wrappedGenerateMetaAds,
    generateLinkedInAds: wrappedGenerateLinkedInAds,
    generateMicrosoftAds: wrappedGenerateMicrosoftAds
  });

  // Use the updated useImageGenerationHandler hook
  const { handleGenerateImage, loadingImageIndex } = useImageGenerationHandler();

  const {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  } = useAdUpdateHandlers({
    setGoogleAds,
    setMetaAds,
    setMicrosoftAds,
    setLinkedInAds
  });

  const { handleBack, handleNext, autoAdvance, setAutoAdvance } = useNavigationHandlers(
    currentStep,
    setCurrentStep,
    setCampaignData
  );

  const handleNextWrapper = (data?: any) => {
    console.log("CampaignContent: handleNextWrapper called with data", data);
    
    setAutoAdvance(false);
    
    if (data) {
      setCampaignData(prev => ({ ...prev, ...data }));
    }
    
    if (!data) {
      toast.success(`Moving to step ${currentStep + 1}`);
      handleNext();
    }
  };

  // Create a wrapper for handleGenerateImage that adapts to the expected signature
  const handleGenerateImageWrapper = async (ad: MetaAd, index: number) => {
    if (!ad) return;
    
    try {
      // Extract the proper prompt from the ad
      const prompt = ad.imagePrompt || ad.description || ad.primaryText || '';
      
      // Call handleGenerateImage with the proper parameters
      const imageUrl = await handleGenerateImage(prompt, {
        index,
        ad,
        companyName: campaignData.companyName,
        format: ad.format || 'square',
        industry: campaignData.industry || ''
      });
      
      if (imageUrl) {
        // Update the ad with the new image URL
        if (metaAds && index < metaAds.length) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else if (linkedInAds) {
          const linkedInIndex = index - (metaAds?.length || 0);
          if (linkedInIndex >= 0 && linkedInIndex < linkedInAds.length) {
            const updatedAds = [...linkedInAds];
            updatedAds[linkedInIndex] = { ...updatedAds[linkedInIndex], imageUrl };
            setLinkedInAds(updatedAds);
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    }
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
    handleGenerateImage: handleGenerateImageWrapper,
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
