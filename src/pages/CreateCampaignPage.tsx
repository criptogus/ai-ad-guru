
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useCampaignState } from "@/hooks/useCampaignState";
import { Stepper } from "@/components/campaign/Stepper";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { AdGenerationStep } from "@/components/campaign/AdGenerationStep";
import { useAdGenerationFlow } from "@/hooks/useAdGenerationFlow";
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";
import { useAdGeneration as useGoogleAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useMetaAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useMicrosoftAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useLinkedInAdGeneration } from "@/hooks/adGeneration";
import { MetaAd } from "@/hooks/adGeneration/types";
import { useImageGenerationHandler } from "@/hooks/campaign/useImageGenerationHandler";
import { useAdGenerationState } from "@/hooks/campaign/useAdGenerationState";
import { useAdGenerationHandlers } from "@/hooks/campaign/useAdGenerationHandlers";

const CreateCampaignPage: React.FC = () => {
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

  const { generateGoogleAds, isGenerating: isGeneratingGoogleAds } = useGoogleAdGeneration({});
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

  // Create a handler for generating images - fix: don't pass any arguments here
  const { 
    handleGenerateImage, 
    loadingImageIndex 
  } = useImageGenerationHandler();

  // Add ad generation handlers
  const {
    handleAdsGenerated,
    handleCreateCampaign,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds
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

  const isGenerating = isGeneratingGoogleAds || isGeneratingMetaAds || 
                      isGeneratingMicrosoftAds || isGeneratingLinkedInAds;
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleNextWrapper = (data?: any) => {
    if (data) {
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
    createCampaign: handleCreateCampaign,
    cacheInfo
  });

  const renderStepContent = () => {
    if (currentStep === 4) {
      return (
        <AdGenerationStep
          analysisResult={analysisResult}
          campaignData={campaignData}
          onAdsGenerated={handleAdsGenerated}
          platforms={campaignData.platforms || []}
        />
      );
    }
    return getStepContent();
  };

  return (
    <CampaignProvider>
      <AppLayout activePage="campaigns">
        <div className="container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
          </div>
          
          <Stepper currentStep={currentStep} />
          
          <Card>
            <CardContent className="p-0">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </CampaignProvider>
  );
};

export default CreateCampaignPage;
