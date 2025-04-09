
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
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useNavigationHandlers } from "@/hooks/campaign/useNavigationHandlers";
import { useAdGenerationWrappers } from "@/hooks/useAdGenerationWrappers";
import { MetaAd } from "@/hooks/adGeneration/types";

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

  // Implement image generation directly in this component
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    try {
      setLoadingImageIndex(index);
      
      // Create the prompt with context
      const promptWithContext = `${ad.imagePrompt || ad.description}. Brand: ${campaignData.name}, Industry: ${campaignData.description}`;
      const formatContext = ad.format ? `. Format: ${ad.format}` : '';
      const finalPrompt = promptWithContext + formatContext;
      
      // Call the image generation function
      let imageResult;
      try {
        imageResult = await generateAdImage(finalPrompt, {
          ad,
          campaignData,
          index
        });
      } catch (error) {
        console.error("Error calling generateAdImage:", error);
        return;
      }
      
      // Extract the image URL from the result
      let imageUrl: string | null = null;
      
      if (typeof imageResult === 'string') {
        imageUrl = imageResult;
      } else if (imageResult && typeof imageResult === 'object' && 'imageUrl' in imageResult) {
        imageUrl = imageResult.imageUrl as string;
      }
      
      // Update the appropriate ads array if we got an image URL
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
