
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
  
  // Credit system
  const { credits, refreshCredits } = useCredits();
  const { checkCreditBalance } = useCreditsManager();
  const [canPublish, setCanPublish] = useState(true);
  
  const steps = [
    { id: 1, name: "Análise do Website" },
    { id: 2, name: "Plataformas" },
    { id: 3, name: "Gatilho Mental" },
    { id: 4, name: "Público & Mercado" },
    { id: 5, name: "Objetivos" },
    { id: 6, name: "Variações de Anúncios" },
    { id: 7, name: "Revisar & Publicar" }
  ];

  // Fetch user credits when component mounts
  useEffect(() => {
    refreshCredits();
    
    // Check if user has enough credits for publication (10 credits)
    const checkPublishCredits = async () => {
      const hasEnough = await checkCreditBalance(10);
      setCanPublish(hasEnough);
    };
    
    checkPublishCredits();
  }, [refreshCredits, checkCreditBalance]);

  const handleStepChange = (newStep: number) => {
    // Only allow going back, not forward through click
    if (newStep < step) {
      setStep(newStep);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = (data?: any) => {
    if (data) {
      // Update campaign data with new information
      setCampaignData(prev => ({ ...prev, ...data }));
    }

    if (step < steps.length) {
      setStep(step + 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinish = async () => {
    // Check if user has enough credits to publish (10 credits)
    const hasEnough = await checkCreditBalance(10);
    
    if (!hasEnough) {
      toast.error("Créditos insuficientes", {
        description: "Você precisa de 10 créditos para publicar a campanha."
      });
      return;
    }
    
    // Consume credits for publication
    const { consumeCredits } = useCreditsManager();
    const creditConsumed = await consumeCredits(10, "Campaign publication");
    
    if (!creditConsumed) {
      toast.error("Erro ao debitar créditos", {
        description: "Não foi possível debitar os créditos necessários para publicação."
      });
      return;
    }
    
    toast.success("Campanha publicada com sucesso!", {
      description: "Seus anúncios foram enviados para publicação."
    });
    
    // Update credits display
    refreshCredits();
    
    // Redirect to campaigns or dashboard
    navigate("/campaigns");
  };

  // Calculate the credit costs for each step
  const getCreditCostForCurrentStep = () => {
    switch (step) {
      case 1: return 2;  // Website Analysis
      case 6: return campaignData.platforms?.length * 5 || 0;  // Ad Generation (5 per platform)
      case 7: return 10; // Publication
      default: return 0;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">Criador de Campanhas com IA</h1>
        
        <Card className="p-4 mb-8">
          <StepIndicator 
            currentStep={step}
            steps={steps}
            onStepClick={handleStepChange}
          />
        </Card>

        {/* Credit display */}
        <div className="bg-muted rounded-lg p-3 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium">Créditos disponíveis:</span>
            <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-md font-bold">
              {credits}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Análise: 2 créditos | Geração: 5 créditos por plataforma | Publicação: 10 créditos
          </div>
        </div>

        {/* Current step credit cost */}
        {getCreditCostForCurrentStep() > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-8">
            <div className="flex items-center text-blue-800 dark:text-blue-300">
              <span>Custo desta etapa: </span>
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded-md font-bold">
                {getCreditCostForCurrentStep()} créditos
              </span>
            </div>
          </div>
        )}

        {/* Step content */}
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
