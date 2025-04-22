
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useCampaignState } from "@/hooks/useCampaignState";
import { useToast } from "@/hooks/use-toast";
import { useAdGenerationState } from "@/hooks/campaign/useAdGenerationState";
import { useAdGeneration as useGoogleAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useMetaAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useMicrosoftAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useLinkedInAdGeneration } from "@/hooks/adGeneration";
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";
import { MetaAd } from "@/hooks/adGeneration/types";
import { useImageGenerationHandler } from "@/hooks/campaign/useImageGenerationHandler";
import { useAdGenerationHandlers } from "@/hooks/campaign/useAdGenerationHandlers";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";

export const useCampaignPageController = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const { 
    analyzeWebsite, 
    analysisResult, 
    setAnalysisResult, 
    isAnalyzing,
    cacheInfo 
  } = useWebsiteAnalysis();

  const { campaignData, setCampaignData } = useCampaignState();

  const {
    googleAds,
    setGoogleAds,
    metaAds,
    setMetaAds,
    microsoftAds,
    setMicrosoftAds,
    linkedInAds,
    setLinkedInAds,
    isCreating,
    setIsCreating
  } = useAdGenerationState();

  const { generateGoogleAds, isGenerating: isGeneratingGoogleAds } = useGoogleAdGeneration();
  const { generateMetaAds, isGenerating: isGeneratingMetaAds } = useMetaAdGeneration();
  const { generateMicrosoftAds, isGenerating: isGeneratingMicrosoftAds } = useMicrosoftAdGeneration();
  const { generateLinkedInAds, isGenerating: isGeneratingLinkedInAds } = useLinkedInAdGeneration();

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

  const { createCampaign } = useCampaignCreation();

  const { 
    handleGenerateImage, 
    loadingImageIndex 
  } = useImageGenerationHandler();

  // Wrap createCampaign to match the expected signature
  const handleCreateCampaign = async () => {
    try {
      const campaignParams = {
        name: campaignData.name || 'New Campaign',
        description: campaignData.description || '',
        platforms: campaignData.platforms || [],
        budget: campaignData.budget || 100,
        budgetType: campaignData.budgetType || 'daily',
        startDate: campaignData.startDate || new Date().toISOString().split('T')[0],
        endDate: campaignData.endDate,
        targetAudience: campaignData.targetAudience || '',
        objective: campaignData.objective || 'awareness',
        googleAds,
        metaAds,
        microsoftAds,
        linkedInAds,
        targetUrl: campaignData.targetUrl || '',
        websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || '',
        mindTriggers: campaignData.mindTriggers || {}
      };
      
      await createCampaign(campaignParams);
      navigate('/campaigns');
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast({
        variant: "destructive",
        title: "Campaign Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create campaign"
      });
    }
  };

  const {
    handleAdsGenerated,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds,
    isGenerating
  } = useAdGenerationHandlers({
    setGoogleAds,
    setMetaAds,
    setMicrosoftAds,
    setLinkedInAds,
    campaignData,
    createCampaign,
    setIsCreating,
    analysisResult,
    generateGoogleAds,
    generateMetaAds,
    generateMicrosoftAds,
    generateLinkedInAds
  });

  const isGeneratingAny = isGeneratingGoogleAds || isGeneratingMetaAds || 
                      isGeneratingMicrosoftAds || isGeneratingLinkedInAds || isGenerating;

  const handleBack = () => {
    if (currentStep > 1) {
      console.log(`Moving back from step ${currentStep} to step ${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 7) {
      console.log(`Moving forward from step ${currentStep} to step ${currentStep + 1}`);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNextWrapper = (data?: any) => {
    if (data) {
      console.log("Updating campaign data:", data);
      setCampaignData(prev => ({ ...prev, ...data }));
    }
    handleNext();
  };

  const handleWebsiteAnalysis = async (url: string) => {
    setCampaignData(prev => ({ ...prev, targetUrl: url }));
    try {
      console.log("Starting website analysis for URL:", url);
      const result = await analyzeWebsite(url);
      if (result) {
        console.log("Analysis successful:", result);
        setCampaignData(prev => ({ 
          ...prev, 
          name: result.companyName ? `${result.companyName} Campaign` : 'New Campaign',
          companyName: result.companyName || prev.companyName || 'New Company',
          description: result.companyDescription || '',
          keywords: result.keywords || [],
          targetAudience: result.targetAudience || '',
          industry: result.industry || ''
        }));
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error analyzing website:", error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to analyze the website. Please try again."
      });
      return null;
    }
  };

  const handleGenerateImageWrapper = async (ad: MetaAd, index: number) => {
    try {
      await handleGenerateImage(ad, index);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  const stepRenderer = useCampaignStepRenderer({
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    microsoftAds,
    linkedInAds,
    isAnalyzing,
    isGenerating: isGeneratingAny,
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
    createCampaign: handleCreateCampaign,
    cacheInfo,
    handleAdsGenerated
  });

  return {
    currentStep,
    setCurrentStep,
    handleBack,
    handleNextWrapper,
    stepRenderer,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    microsoftAds,
    linkedInAds,
    isAnalyzing,
    isGenerating: isGeneratingAny,
    loadingImageIndex,
    isCreating
  };
};
