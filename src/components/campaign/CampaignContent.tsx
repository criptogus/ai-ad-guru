
import React, { useEffect } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import { useToast } from "@/hooks/use-toast";
import { useCampaignStepRenderer } from "@/hooks/useCampaignStepRenderer";
import { MetaAd } from "@/hooks/adGeneration";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useCampaignFlow } from "@/hooks/useCampaignFlow";
import { useCampaignActions } from "@/hooks/campaignActions";
import { useAuth } from "@/contexts/AuthContext";

const CampaignContent: React.FC = () => {
  const { toast } = useToast();
  const auth = useAuth();
  const user = auth?.user;
  
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
    setMicrosoftAds
  } = useCampaign();

  // Initialize the ad generation hook
  const { 
    generateGoogleAds, 
    generateMetaAds, 
    generateAdImage, 
    isGenerating 
  } = useAdGeneration();
  
  // Initialize the website analysis hook for error state tracking
  const { isAnalyzing: isAnalyzingState } = useWebsiteAnalysis();

  // Convert LinkedInAds to MetaAds format for compatibility
  const convertedMetaAds: MetaAd[] = linkedInAds.map(ad => ({
    primaryText: ad.primaryText,
    headline: ad.headline,
    description: ad.description,
    imagePrompt: ad.imagePrompt || '', // Ensure imagePrompt is never undefined
    imageUrl: ad.imageUrl
  }));

  // Campaign actions (website analysis, ad generation, campaign creation)
  const {
    handleAnalyzeWebsite,
    isAnalyzing,
    handleGenerateGoogleAds,
    handleGenerateLinkedInAds,
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
    generateMetaAds, // Use generateMetaAds for LinkedIn ads
    generateGoogleAds, // Reuse for Microsoft ads
    generateAdImage,
    setCampaignData
  );

  // Campaign flow (navigation and validation)
  const { handleBack, handleNextWrapper } = useCampaignFlow(
    currentStep,
    setCurrentStep,
    analysisResult,
    campaignData,
    user,
    createCampaign
  );

  // Callback to update website analysis results
  const handleWebsiteAnalysis = async (url: string) => {
    const result = await handleAnalyzeWebsite(url);
    if (result) {
      setAnalysisResult(result);
      setCampaignData({
        ...campaignData,
        websiteUrl: url,
        targetAudience: result.targetAudience,
        description: result.businessDescription
      });
    }
    return result;
  };

  // Callbacks for updating ads
  const handleUpdateGoogleAd = (index: number, updatedAd: any) => {
    const newAds = [...googleAds];
    newAds[index] = updatedAd;
    setGoogleAds(newAds);
  };

  const handleUpdateLinkedInAd = (index: number, updatedAd: any) => {
    const newAds = [...linkedInAds];
    newAds[index] = updatedAd;
    setLinkedInAds(newAds);
  };

  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    const newAds = [...microsoftAds];
    newAds[index] = updatedAd;
    setMicrosoftAds(newAds);
  };

  // Wrap handlers to return void to match expected type
  const handleGenerateLinkedInAdsWrapper = async (): Promise<void> => {
    await handleGenerateLinkedInAds();
  };

  const handleGenerateMicrosoftAdsWrapper = async (): Promise<void> => {
    await handleGenerateMicrosoftAds();
  };

  // Step renderer props
  const stepRendererProps = {
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds: convertedMetaAds,
    microsoftAds,
    isAnalyzing: isAnalyzing || isAnalyzingState,
    isGenerating,
    loadingImageIndex: null,
    isCreating,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds: handleGenerateLinkedInAdsWrapper,
    handleGenerateMicrosoftAds: handleGenerateMicrosoftAdsWrapper,
    handleGenerateImage,
    handleUpdateGoogleAd,
    handleUpdateMetaAd: handleUpdateLinkedInAd,
    handleUpdateMicrosoftAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign
  };

  const { getStepContent } = useCampaignStepRenderer(stepRendererProps);

  return <div>{getStepContent()}</div>;
};

export default CampaignContent;
