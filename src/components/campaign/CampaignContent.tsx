
import React, { useState, useEffect } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { useAuth } from "@/contexts/AuthContext"; // Fixed import
import { useCampaignActions } from "@/hooks/campaignActions";
import CampaignHeader from "./CampaignHeader";
import StepIndicator from "./StepIndicator";
import StepNavigation from "./StepNavigation";
import { InstaAdTestLink } from "@/components/testing/meta";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

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

  const { generateGoogleAds, generateAdImage, generateMetaAds } = useAdGeneration();

  // Create stub functions for LinkedIn and Microsoft ads as they're not implemented yet
  const generateLinkedInAds = async (campaignData: any) => {
    console.log("LinkedIn Ads generation not implemented yet", campaignData);
    return [];
  };

  const generateMicrosoftAds = async (campaignData: any) => {
    console.log("Microsoft Ads generation not implemented yet", campaignData);
    return [];
  };

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
      // Fix: Changed the second parameter to index instead of object
      await handleGenerateImage(ad.imagePrompt, index);
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

  // Use async/void to fix the type issue
  const wrappedHandleGenerateGoogleAds = async (): Promise<void> => {
    await handleGenerateGoogleAds();
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
    handleGenerateGoogleAds: wrappedHandleGenerateGoogleAds,
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
        <CampaignHeader onBack={handleBack} currentStep={currentStep} />
        <InstaAdTestLink />
      </div>
      
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
        currentStep={currentStep}
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={isCreating}
      />
    </div>
  );
};

export default CampaignContent;
