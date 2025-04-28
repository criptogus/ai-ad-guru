import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import StepIndicator from "@/components/campaign/StepIndicator";
import { useCredits } from "@/contexts/CreditsContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import WebsiteAnalysisStep from "./steps/WebsiteAnalysisStep";
import PlatformSelectionStep from "./steps/PlatformSelectionStep";
import MindTriggerStep from "./steps/MindTriggerStep";
import AudienceMarketStep from "./steps/AudienceMarketStep";
import CampaignObjectivesStep from "./steps/CampaignObjectivesStep";
import AdVariationsStep from "./steps/AdVariationsStep";
import ReviewPublishStep from "./steps/ReviewPublishStep";
import { useCreditsManager } from "@/hooks/useCreditsManager";
import { useLanguage } from "@/contexts/LanguageContext";
import AdManagerDebug from "./AdManagerDebug";

const AdManager = () => {
  const [step, setStep] = useState(1);
  const [campaignData, setCampaignData] = useState<any>({
    websiteUrl: "",
    businessName: "",
    businessType: "",
    industry: "",
    products: [],
    keywords: [],
    platforms: [],
    mindTrigger: "",
    audienceProfile: "",
    geolocation: "",
    marketAnalysis: "",
    competitorInsights: "",
    campaignGoal: "",
    startDate: "",
    endDate: "",
    budget: {},
    ads: {}
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const { credits, refreshCredits } = useCredits();
  const { checkCreditBalance } = useCreditsManager();
  const [canPublish, setCanPublish] = useState(true);
  
  const steps = [
    { id: 1, name: t('adManager.step.websiteAnalysis') },
    { id: 2, name: t('adManager.step.platforms') },
    { id: 3, name: t('adManager.step.mindTrigger') },
    { id: 4, name: t('adManager.step.audienceMarket') },
    { id: 5, name: t('adManager.step.objectives') },
    { id: 6, name: t('adManager.step.adVariations') },
    { id: 7, name: t('adManager.step.reviewPublish') }
  ];

  useEffect(() => {
    refreshCredits();
    
    const checkPublishCredits = async () => {
      const hasEnough = await checkCreditBalance(10);
      setCanPublish(hasEnough);
    };
    
    checkPublishCredits();
  }, [refreshCredits, checkCreditBalance]);

  const handleStepChange = (newStep: number) => {
    if (newStep < step) {
      setStep(newStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = (data?: any) => {
    if (data) {
      setCampaignData(prev => ({ ...prev, ...data }));
    }

    if (step < steps.length) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = async () => {
    const hasEnough = await checkCreditBalance(10);
    
    if (!hasEnough) {
      toast.error(t('adManager.errors.insufficientCredits'), {
        description: t('adManager.errors.creditsNeeded')
      });
      return;
    }
    
    const { consumeCredits } = useCreditsManager();
    const creditConsumed = await consumeCredits(10, "Campaign publication");
    
    if (!creditConsumed) {
      toast.error(t('adManager.errors.creditDebitError'), {
        description: t('adManager.errors.creditDebitDescription')
      });
      return;
    }
    
    toast.success(t('adManager.success.campaignPublished'), {
      description: t('adManager.success.campaignPublishedDescription')
    });
    
    refreshCredits();
    
    navigate("/campaigns");
  };

  const getCreditCostForCurrentStep = () => {
    switch (step) {
      case 1: return 2;
      case 6: return campaignData.platforms?.length * 5 || 0;
      case 7: return 10;
      default: return 0;
    }
  };

  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && e.ctrlKey) {
        setShowDebug(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-6">{t('adManager.title')}</h1>
        
        {showDebug && <AdManagerDebug />}
        
        <Card className="p-4 mb-8">
          <StepIndicator 
            currentStep={step}
            steps={steps}
            onStepClick={handleStepChange}
          />
        </Card>

        <div className="bg-muted rounded-lg p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center">
            <span className="text-sm font-medium">{t('adManager.creditsAvailable')}:</span>
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-md font-bold">
              {credits}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t('adManager.creditUsage.analysis')}: 2 | {t('adManager.creditUsage.generation')}: 5 | {t('adManager.creditUsage.publication')}: 10
          </div>
        </div>

        {getCreditCostForCurrentStep() > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-8">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <span>{t('adManager.currentStepCost')}: </span>
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-md font-bold">
                {getCreditCostForCurrentStep()} {t('adManager.credits')}
              </span>
            </div>
          </div>
        )}

        <Card className="p-6">
          {step === 1 && (
            <WebsiteAnalysisStep
              campaignData={campaignData}
              analysisResult={analysisResult}
              setAnalysisResult={setAnalysisResult}
              isAnalyzing={isAnalyzing}
              setIsAnalyzing={setIsAnalyzing}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <PlatformSelectionStep
              campaignData={campaignData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 3 && (
            <MindTriggerStep
              campaignData={campaignData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 4 && (
            <AudienceMarketStep
              campaignData={campaignData}
              analysisResult={analysisResult}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 5 && (
            <CampaignObjectivesStep
              campaignData={campaignData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 6 && (
            <AdVariationsStep
              campaignData={campaignData}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {step === 7 && (
            <ReviewPublishStep
              campaignData={campaignData}
              onBack={handleBack}
              onFinish={handleFinish}
              canPublish={canPublish}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdManager;
