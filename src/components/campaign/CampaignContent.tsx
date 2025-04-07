
import React, { useState } from "react";
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
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";
import { normalizeGoogleAd, normalizeMetaAd } from "@/lib/utils";
import { useAdGenerationWrappers } from "@/hooks/useAdGenerationWrappers";

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

  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

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

  const handleGenerateImageWrapper = async (prompt: string, additionalContext?: any): Promise<string | null> => {
    try {
      const result = await generateAdImage(prompt, additionalContext);
      return typeof result === 'string' ? result : (typeof result === 'object' && result?.imageUrl ? result.imageUrl : null);
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      setLoadingImageIndex(index);
      
      // Create prompt with context
      const promptWithContext = `${ad.imagePrompt || ad.description}. Brand: ${campaignData?.name || ''}, Industry: ${campaignData?.description || ''}`;
      
      // Add format context if it exists, using optional chaining
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      const imageUrl = await handleGenerateImageWrapper(finalPrompt, {
        ad,
        campaignData,
        index
      });

      if (imageUrl) {
        // Create a new updated ad object with the image URL
        const updatedAd: MetaAd = { 
          ...ad, 
          imageUrl 
        };
        
        // Update the appropriate ads array based on which ad type it is
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = updatedAd;
          setLinkedInAds(updatedAds);
        }
      }
    } catch (error) {
      console.error("Error in handleGenerateImage:", error);
    } finally {
      setLoadingImageIndex(null);
    }
  };

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
    setAutoAdvance(false);
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
