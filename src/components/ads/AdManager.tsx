
import React, { useState } from "react";
import { GenerateAds } from "./steps/GenerateAds";
import { ReviewAds } from "./steps/ReviewAds";
import { PublishAds } from "./steps/PublishAds";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import StepIndicator from "@/components/campaign/StepIndicator";
import { useCredits } from "@/contexts/CreditsContext";
import { toast } from "sonner";

const AdManager = () => {
  const [step, setStep] = useState(1);
  const [generatedAds, setGeneratedAds] = useState<Record<string, any[]>>({});
  const [approvedAds, setApprovedAds] = useState<Record<string, any[]>>({});
  const [campaignData, setCampaignData] = useState<any>(null);
  const navigate = useNavigate();
  const { credits } = useCredits();

  const steps = [
    { id: 1, name: "Gerar" },
    { id: 2, name: "Revisar" },
    { id: 3, name: "Publicar" }
  ];

  const handleStepChange = (newStep: number) => {
    // Only allow going back, not forward
    if (newStep < step) {
      setStep(newStep);
    }
  };

  const handleFinish = () => {
    toast.success("Campanha publicada com sucesso!", {
      description: "Seus anúncios foram enviados para publicação."
    });
    // Redirect to campaigns or dashboard
    navigate("/campaigns");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl font-bold mb-4">Gerenciador de Anúncios</h1>
        
        <Card className="p-4 mb-8">
          <StepIndicator 
            currentStep={step}
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
            Geração: 5 créditos | Publicação: 10 créditos
          </div>
        </div>

        {step === 1 && (
          <GenerateAds
            onNext={(ads: Record<string, any[]>, data: any) => {
              setGeneratedAds(ads);
              setCampaignData(data);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <ReviewAds
            ads={generatedAds}
            onApprove={(approved: Record<string, any[]>) => {
              setApprovedAds(approved);
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <PublishAds
            ads={approvedAds}
            campaignData={campaignData}
            onBack={() => setStep(2)}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
};

export default AdManager;
