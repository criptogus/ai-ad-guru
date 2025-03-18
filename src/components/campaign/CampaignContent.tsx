
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaign } from "@/contexts/CampaignContext";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration } from "@/hooks/adGeneration";
import { useCampaignActions } from "@/hooks/useCampaignActions";
import { useCampaignSteps } from "@/hooks/useCampaignSteps";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import CampaignHeader from "./CampaignHeader";
import StepNavigation from "./StepNavigation";

const CampaignContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  
  const { 
    campaignData, 
    setCampaignData, 
    analysisResult, 
    setAnalysisResult,
    updateAnalysisResult,
    googleAds, 
    setGoogleAds, 
    metaAds, 
    setMetaAds, 
    currentStep, 
    setCurrentStep 
  } = useCampaign();

  // Website analysis and ad generation hooks
  const { analyzeWebsite, isAnalyzing } = useWebsiteAnalysis();
  const { 
    generateGoogleAds, 
    generateMetaAds, 
    generateAdImage, 
    isGenerating,
    googleAds: adGenerationGoogleAds,
    metaAds: adGenerationMetaAds
  } = useAdGeneration();

  // Sync ads from the adGeneration hook to the campaign context
  useEffect(() => {
    if (adGenerationGoogleAds && adGenerationGoogleAds.length > 0) {
      setGoogleAds(adGenerationGoogleAds);
    }
  }, [adGenerationGoogleAds, setGoogleAds]);

  useEffect(() => {
    if (adGenerationMetaAds && adGenerationMetaAds.length > 0) {
      setMetaAds(adGenerationMetaAds);
    }
  }, [adGenerationMetaAds, setMetaAds]);

  // Campaign step navigation
  const { handleBack, handleNext } = useCampaignSteps(
    currentStep, 
    setCurrentStep, 
    analysisResult, 
    campaignData, 
    user
  );

  // Campaign actions
  const {
    handleAnalyzeWebsite,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage,
    createCampaign
  } = useCampaignActions(
    user, 
    campaignData, 
    analysisResult, 
    googleAds, 
    metaAds,
    generateGoogleAds,
    generateMetaAds,
    generateAdImage,
    setCampaignData
  );

  // Custom handler for website analysis that also updates the campaign data
  const handleWebsiteAnalysis = async (url: string) => {
    const result = await analyzeWebsite(url);
    if (result) {
      setCampaignData(prev => ({
        ...prev,
        websiteUrl: url,
        businessInfo: result,
        name: `${result.companyName} Campaign`,
        description: result.businessDescription,
        targetAudience: result.targetAudience
      }));
      setAnalysisResult(result);
    }
    return result;
  };

  // Handle updates to Google ads
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setGoogleAds(updatedAds);
    
    // Update campaign data as well
    setCampaignData((prev) => ({
      ...prev,
      googleAds: updatedAds
    }));
  };

  // Handle updates to Meta ads
  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setMetaAds(updatedAds);
    
    // Update campaign data as well
    setCampaignData((prev) => ({
      ...prev,
      metaAds: updatedAds
    }));
  };

  // Wrapper for handling image generation with loading state
  const handleGenerateImageWrapper = async (ad: MetaAd, index: number) => {
    setLoadingImageIndex(index);
    await handleGenerateImage(ad, index);
    setLoadingImageIndex(null);
  };

  // Log the current state of ads for debugging
  console.log("CampaignContent - googleAds state:", googleAds);
  console.log("CampaignContent - metaAds state:", metaAds);

  // Wrapper for next button to create campaign when needed
  const handleNextWrapper = () => {
    const shouldCreateCampaign = handleNext();
    if (shouldCreateCampaign && currentStep === 3) {
      createCampaign();
    }
  };

  // Step content renderer
  const { getStepContent } = useCampaignStepRenderer({
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    isAnalyzing,
    isGenerating,
    loadingImageIndex,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage: handleGenerateImageWrapper,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    setCampaignData,
    handleBack,
    handleNextWrapper
  });

  return (
    <div className="p-8">
      <CampaignHeader onBack={handleBack} />
      <div className="mb-8">
        <StepNavigation />
        {getStepContent()}
      </div>
    </div>
  );
};

export default CampaignContent;
