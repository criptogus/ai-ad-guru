
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCampaign } from "@/contexts/CampaignContext";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration } from "@/hooks/adGeneration";
import { useCampaignActions } from "@/hooks/useCampaignActions";
import { useCampaignSteps } from "@/hooks/useCampaignSteps";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

// Import our components
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";
import StepNavigation from "@/components/campaign/StepNavigation";

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
  const { generateGoogleAds, generateMetaAds, generateAdImage, isGenerating } = useAdGeneration();

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

  // Wrapper for next button to create campaign when needed
  const handleNextWrapper = () => {
    const shouldCreateCampaign = handleNext();
    if (shouldCreateCampaign && currentStep === 3) {
      createCampaign();
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={handleWebsiteAnalysis}
            onNext={handleNextWrapper}
          />
        );
      case 2:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult!}
            campaignData={campaignData}
            onUpdateCampaignData={setCampaignData}
            onBack={handleBack}
            onNext={handleNextWrapper}
          />
        );
      case 3:
        return (
          <AdPreviewStep
            analysisResult={analysisResult!}
            googleAds={googleAds}
            metaAds={metaAds}
            isGenerating={isGenerating}
            onGenerateGoogleAds={handleGenerateGoogleAds}
            onGenerateMetaAds={handleGenerateMetaAds}
            onGenerateImage={handleGenerateImage}
            onUpdateGoogleAd={handleUpdateGoogleAd}
            onUpdateMetaAd={handleUpdateMetaAd}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-2" onClick={handleBack}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">Let AI help you create a high-converting ad campaign</p>
        </div>
      </div>

      <div className="mb-8">
        <StepNavigation />
        {getStepContent()}
      </div>
    </div>
  );
};

export default CampaignContent;
