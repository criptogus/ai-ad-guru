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

const CreateCampaignPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    analyzeWebsite, 
    analysisResult, 
    setAnalysisResult, 
    isAnalyzing,
    cacheInfo 
  } = useWebsiteAnalysis();
  
  const { 
    campaignData, 
    setCampaignData, 
    googleAds, 
    setGoogleAds, 
    metaAds, 
    setMetaAds,
    microsoftAds,
    setMicrosoftAds,
    linkedInAds,
    setLinkedInAds
  } = useCampaignState();
  
  const { 
    generateGoogleAds, 
    isGenerating: isGeneratingGoogleAds 
  } = useGoogleAdGeneration({});
  const { 
    generateMetaAds, 
    isGenerating: isGeneratingMetaAds 
  } = useMetaAdGeneration();
  const { 
    generateMicrosoftAds, 
    isGenerating: isGeneratingMicrosoftAds 
  } = useMicrosoftAdGeneration();
  const { 
    generateLinkedInAds, 
    isGenerating: isGeneratingLinkedInAds 
  } = useLinkedInAdGeneration();
  
  const { handleGenerateImage, loadingImageIndex } = useImageGenerationHandler({
    metaAds,
    linkedInAds,
    setMetaAds,
    setLinkedInAds,
    campaignData
  });
  
  const { createCampaign } = useCampaignCreation();
  
  const isGenerating = isGeneratingGoogleAds || isGeneratingMetaAds || isGeneratingMicrosoftAds || isGeneratingLinkedInAds;
  
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
          description: result.companyDescription || '',
          keywords: result.keywords || [],
          targetAudience: result.targetAudience || '',
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

  const handleAdsGenerated = (generatedAds: any) => {
    if (!generatedAds) return;

    // Update relevant ad states based on platforms
    if (generatedAds.google_ads) {
      setGoogleAds(generatedAds.google_ads);
    }
    if (generatedAds.meta_ads) {
      setMetaAds(generatedAds.meta_ads);
    }
    if (generatedAds.linkedin_ads) {
      setLinkedInAds(generatedAds.linkedin_ads);
    }
    if (generatedAds.microsoft_ads) {
      setMicrosoftAds(generatedAds.microsoft_ads);
    }

    // Move to next step after generation
    handleNext();
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
    handleGenerateGoogleAds: () => {},  // These will be handled by AdGenerationStep
    handleGenerateMetaAds: () => {},
    handleGenerateMicrosoftAds: () => {},
    handleGenerateLinkedInAds: () => {},
    handleGenerateImage,
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

  // Insert AdGenerationStep at the appropriate step (after platform selection)
  const renderStepContent = () => {
    if (currentStep === 4) {  // Adjust step number as needed
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

  console.log("CreateCampaignPage rendering with step:", currentStep, "and campaign data:", campaignData);

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
