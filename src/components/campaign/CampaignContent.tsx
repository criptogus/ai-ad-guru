import React, { useState, useEffect } from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import CampaignHeader from "./CampaignHeader";
import StepIndicator from "./StepIndicator";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAudienceAnalysis } from "@/hooks/useAudienceAnalysis";
import { useAdGeneration, GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { useCampaignCreation } from "@/hooks/campaignActions/useCampaignCreation";
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

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { createCampaign, isCreating } = useCampaignCreation(
    user,
    campaignData,
    googleAds,
    metaAds
  );
  
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const handleWebsiteAnalysis = async (url: string) => {
    const result = await analyzeWebsite(url);
    if (result) {
      setAnalysisResult(result);
      
      setCampaignData(prev => ({
        ...prev,
        targetUrl: result.websiteUrl,
        targetAudience: result.targetAudience
      }));
    }
    return result;
  };

  const handleAudienceAnalysis = async (platform?: string) => {
    if (!analysisResult) return;
    
    const result = await analyzeAudience(analysisResult, platform);
    if (result) {
      setAudienceAnalysisResult(result);
      
      setCampaignData(prev => ({
        ...prev,
        audienceAnalysis: result
      }));
    }
  };

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

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!ad.imagePrompt) return;
    
    setLoadingImageIndex(index);
    
    try {
      const imageUrl = await generateAdImage(ad.imagePrompt);
      
      if (imageUrl) {
        const updatedAd = { ...ad, imageUrl };
        
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
    if (currentStep === 1) {
      handleNext(data);
    } else if (currentStep === 2) {
      handleNext(data);
    } else if (currentStep === 3) {
      handleNext(data);
    } else if (currentStep === 4) {
      handleNext(data);
    } else {
      handleNext(data);
    }
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
    <div className="w-full">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <CampaignHeader onBack={handleBack} currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <StepIndicator currentStep={currentStep} />
          </div>
          
          <div className="lg:col-span-9">
            <div className="card-modern p-6 bg-card shadow-md">
              {getStepContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignContent;
