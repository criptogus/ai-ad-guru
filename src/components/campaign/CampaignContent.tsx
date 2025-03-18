
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaign } from "@/contexts/CampaignContext";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration } from "@/hooks/adGeneration";
import { useCampaignActions } from "@/hooks/useCampaignActions";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";
import CampaignHeader from "./CampaignHeader";
import StepNavigation from "./StepNavigation";
import { useCampaignAdUpdates } from "./CampaignAdUpdates";
import { useCampaignDataSync } from "@/hooks/useCampaignDataSync";
import { useCampaignFlow } from "@/hooks/useCampaignFlow";

const CampaignContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  useCampaignDataSync(
    adGenerationGoogleAds,
    adGenerationMetaAds,
    setGoogleAds,
    setMetaAds
  );

  // Campaign actions
  const {
    handleAnalyzeWebsite,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage,
    createCampaign,
    isCreating
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

  // Campaign flow (back, next, create campaign)
  const { handleBack, handleNextWrapper } = useCampaignFlow(
    currentStep,
    setCurrentStep,
    analysisResult,
    campaignData,
    user,
    createCampaign
  );

  // Ad updates and image generation handling - Now using the hook instead of component
  const {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleGenerateImageWrapper,
    loadingImageIndex
  } = useCampaignAdUpdates({
    googleAds,
    metaAds,
    setGoogleAds,
    setMetaAds,
    setCampaignData,
    handleGenerateImage
  });

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
    isCreating,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateImage: handleGenerateImageWrapper,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign
  });

  return (
    <div className="p-8">
      <CampaignHeader onBack={handleBack} />
      <div className="mb-8">
        <StepNavigation totalSteps={4} currentStep={currentStep} />
        {getStepContent()}
      </div>
    </div>
  );
};

export default CampaignContent;
