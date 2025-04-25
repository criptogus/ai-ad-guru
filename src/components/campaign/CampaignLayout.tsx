
import React from "react";
import CampaignHeader from "./CampaignHeader";
import StepIndicator from "./StepIndicator";

interface CampaignLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
  currentStep: number;
}

const CampaignLayout: React.FC<CampaignLayoutProps> = ({
  children,
  onBack,
  currentStep
}) => {
  // Define the steps for the campaign creation process
  const steps = [
    { id: 1, name: "Website" },
    { id: 2, name: "Plataformas" },
    { id: 3, name: "Gatilhos" },
    { id: 4, name: "Público" },
    { id: 5, name: "Configuração" },
    { id: 6, name: "Visualização" },
    { id: 7, name: "Resumo" }
  ];

  return (
    <div className="w-full">
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        <CampaignHeader onBack={onBack} currentStep={currentStep} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start">
            <StepIndicator currentStep={currentStep} steps={steps} />
          </div>
          
          <div className="lg:col-span-9">
            <div className="card-modern p-6 bg-card shadow-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignLayout;
