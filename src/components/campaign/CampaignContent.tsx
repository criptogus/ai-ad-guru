
import React, { useState, useEffect } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import CampaignHeader from "./CampaignHeader";
import StepIndicator from "./StepIndicator";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis } from "@/hooks/useAudienceAnalysis";
import { useAdGeneration, GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";

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

  const { createCampaign, isCreating } = useCampaignCreation();
  
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  // Handle website analysis
  const handleWebsiteAnalysis = async (url: string) => {
    const result = await analyzeWebsite(url);
    if (result) {
      setAnalysisResult(result);
      
      // Update campaign data with results from analysis
      setCampaignData(prev => ({
        ...prev,
        targetUrl: result.websiteUrl,
        targetAudience: result.targetAudience
      }));
    }
    return result;
  };

  // Handle audience analysis
  const handleAudienceAnalysis = async (platform?: string) => {
    if (!analysisResult) return;
    
    const result = await analyzeAudience(analysisResult, platform);
    if (result) {
      setAudienceAnalysisResult(result);
      
      // Store the result in campaign data
      setCampaignData(prev => ({
        ...prev,
        audienceAnalysis: result
      }));
    }
  };

  // Handle ad generation
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) return;
    
    const platform = "google";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateGoogleAds(analysisResult, mindTrigger);
    if (ads) {
      setGoogleAds(ads);
    }
  };

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) return;
    
    const platform = "meta";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateMetaAds(analysisResult, mindTrigger);
    if (ads) {
      setMetaAds(ads);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult) return;
    
    const platform = "linkedin";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateLinkedInAds(analysisResult, mindTrigger);
    if (ads) {
      setLinkedInAds(ads);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult) return;
    
    const platform = "microsoft";
    const mindTrigger = campaignData.mindTriggers?.[platform];
    
    const ads = await generateMicrosoftAds(analysisResult, mindTrigger);
    if (ads) {
      setMicrosoftAds(ads);
    }
  };

  // Handle image generation
  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) return;
    
    setLoadingImageIndex(index);
    
    try {
      const imageUrl = await generateAdImage(ad.imagePrompt);
      
      if (imageUrl) {
        // Update the ad with the generated image
        const updatedAd = { ...ad, imageUrl };
        
        // Update the appropriate ad array based on context
        const platform = campaignData.currentEditingPlatform || "meta";
        
        if (platform === "meta") {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          setMetaAds(updatedAds);
        } else if (platform === "linkedin") {
          const updatedAds = [...linkedInAds];
          updatedAds[index] = updatedAd;
          setLinkedInAds(updatedAds);
        }
      }
    } finally {
      setLoadingImageIndex(null);
    }
  };

  // Handle ad updates
  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd) => {
    const newAds = [...googleAds];
    newAds[index] = updatedAd;
    setGoogleAds(newAds);
  };

  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd) => {
    const newAds = [...metaAds];
    newAds[index] = updatedAd;
    setMetaAds(newAds);
  };

  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    const newAds = [...microsoftAds];
    newAds[index] = updatedAd;
    setMicrosoftAds(newAds);
  };

  const handleUpdateLinkedInAd = (index: number, updatedAd: any) => {
    const newAds = [...linkedInAds];
    newAds[index] = updatedAd;
    setLinkedInAds(newAds);
  };

  // Navigation
  const handleNext = (data?: any) => {
    if (data) {
      setCampaignData(prev => ({
        ...prev,
        ...data
      }));
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleNextWrapper = (data?: any) => {
    // Perform any specific actions based on current step
    if (currentStep === 1) {
      // After website analysis
      handleNext(data);
    } else if (currentStep === 2) {
      // After platform selection
      handleNext(data);
    } else if (currentStep === 3) {
      // After mind trigger selection
      handleNext(data);
    } else if (currentStep === 4) {
      // After audience analysis
      handleNext(data);
    } else {
      handleNext(data);
    }
  };

  // Content renderer
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
    <div className="py-6 px-4 md:px-6 space-y-8">
      <CampaignHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <StepIndicator currentStep={currentStep} />
        </div>
        
        <div className="lg:col-span-3">
          {getStepContent()}
        </div>
      </div>
    </div>
  );
};

export default CampaignContent;
