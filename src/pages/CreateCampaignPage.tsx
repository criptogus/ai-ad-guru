
import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration } from "@/hooks/useAdGeneration";
import { CampaignProvider, useCampaign } from "@/contexts/CampaignContext";
import { useCampaignActions } from "@/hooks/useCampaignActions";

// Import our components
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";
import StepNavigation from "@/components/campaign/StepNavigation";

const CampaignContent: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    campaignData, 
    setCampaignData, 
    analysisResult, 
    setAnalysisResult, 
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && !analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2) {
      if (!campaignData.name || !campaignData.description) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (user && user.credits < 5) {
        toast({
          title: "Insufficient credits",
          description: "You need at least 5 credits to create a campaign",
          variant: "destructive",
        });
        return;
      }
      
      createCampaign();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  // Set analysis result when it changes
  React.useEffect(() => {
    setAnalysisResult(analysisResult);
  }, [analysisResult, setAnalysisResult]);

  // Set ad states when they change
  React.useEffect(() => {
    setGoogleAds(googleAds);
    setMetaAds(metaAds);
  }, [googleAds, metaAds, setGoogleAds, setMetaAds]);

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={(url) => handleAnalyzeWebsite(url, analyzeWebsite)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult!}
            campaignData={campaignData}
            onUpdateCampaignData={setCampaignData}
            onBack={handleBack}
            onNext={handleNext}
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
            onNext={handleNext}
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

const CreateCampaignPage: React.FC = () => {
  return (
    <AppLayout activePage="campaigns">
      <CampaignProvider>
        <CampaignContent />
      </CampaignProvider>
    </AppLayout>
  );
};

export default CreateCampaignPage;
