
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

  // Using the extracted hooks with proper props objects
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
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds
  });

  // Adjust the handler to match the expected signature for generateAdImage
  const handleGenerateImageWrapper = async (ad: MetaAd, index: number): Promise<void> => {
    if (!ad.imagePrompt) return;
    
    try {
      // Extract the prompt from the ad
      const prompt = ad.imagePrompt;
      
      // Create additional context from the ad
      const additionalInfo = {
        headline: ad.headline,
        primaryText: ad.primaryText,
        description: ad.description,
        format: ad.format || "feed",
        platform: "meta",
        index
      };
      
      // Call the generateAdImage with the correct parameters
      const imageUrl = await generateAdImage(prompt, additionalInfo);
      
      if (imageUrl) {
        // Update the ad with the generated image URL
        const updatedAd = { ...ad, imageUrl };
        
        // Update the correct ad array based on the current editing platform
        if (campaignData?.currentEditingPlatform === "linkedin") {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = updatedAd;
          setLinkedInAds(updatedAds);
        } else {
          // Default to meta
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const { 
    loadingImageIndex 
  } = useImageGenerationHandler({
    generateAdImage,
    metaAds,
    linkedInAds,
    setMetaAds,
    setLinkedInAds,
    campaignData
  });

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

  // This wrapper function is crucial for proper navigation
  const handleNextWrapper = (data?: any) => {
    // Set autoAdvance to false to prevent automatic progression after AI fills
    setAutoAdvance(false);
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
