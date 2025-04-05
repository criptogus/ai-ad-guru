
import React, { useState } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis } from "@/hooks/useAudienceAnalysis";
import { useAdGeneration, GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { useCampaignCreation } from "@/hooks/campaignActions/useCampaignCreation";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";
import CampaignLayout from "./CampaignLayout";
import { useWebsiteAnalysisHandler } from "@/hooks/campaign/useWebsiteAnalysisHandler";
import { useAudienceAnalysisHandler } from "@/hooks/campaign/useAudienceAnalysisHandler";
import { useAdGenerationHandlers } from "@/hooks/campaign/useAdGenerationHandlers";
import { useImageGenerationHandler } from "@/hooks/campaign/useImageGenerationHandler";
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useNavigationHandlers } from "@/hooks/campaign/useNavigationHandlers";
import { normalizeGoogleAd, normalizeMetaAd } from "@/lib/utils";

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

  // Create properly typed wrapper functions to ensure consistent type handling
  const typedGenerateGoogleAds = async (input: any, trigger?: string): Promise<GoogleAd[]> => {
    const result = await generateGoogleAds(input, trigger);
    return result ? result.map(ad => normalizeGoogleAd(ad)) : [];
  };

  const typedGenerateMetaAds = async (input: any, trigger?: string): Promise<MetaAd[]> => {
    const result = await generateMetaAds(input, trigger);
    return result ? result.map(ad => normalizeMetaAd(ad)) : [];
  };

  const typedGenerateLinkedInAds = async (input: any, trigger?: string): Promise<MetaAd[]> => {
    const result = await generateLinkedInAds(input, trigger);
    return result ? result.map(ad => normalizeMetaAd(ad)) : [];
  };

  const typedGenerateMicrosoftAds = async (input: any, trigger?: string): Promise<GoogleAd[]> => {
    const result = await generateMicrosoftAds(input, trigger);
    return result ? result.map(ad => normalizeGoogleAd(ad)) : [];
  };

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
    generateGoogleAds: typedGenerateGoogleAds,
    generateMetaAds: typedGenerateMetaAds,
    generateLinkedInAds: typedGenerateLinkedInAds,
    generateMicrosoftAds: typedGenerateMicrosoftAds
  });

  // Create a properly typed wrapper for image generation
  const handleGenerateImageWrapper = async (prompt: string, additionalContext?: any): Promise<string | null> => {
    try {
      const result = await generateAdImage(prompt, additionalContext);
      return typeof result === 'string' ? result : null;
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  };

  // Create the actual image generation handler
  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      setLoadingImageIndex(index);
      const promptWithContext = `${ad.imagePrompt || ad.description}. Brand: ${campaignData?.name || ''}, Industry: ${campaignData?.description || ''}`;
      
      // Add format context if it exists
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      const imageUrl = await handleGenerateImageWrapper(finalPrompt, {
        ad,
        campaignData,
        index
      });

      if (imageUrl) {
        if (metaAds[index]) {
          const updatedAds = [...metaAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
          setMetaAds(updatedAds);
        } else if (linkedInAds[index]) {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = { ...updatedAds[index], imageUrl };
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
