
import React from "react";
import { useCampaign } from "@/contexts/CampaignContext";
import StepIndicator from "./StepIndicator";

const StepNavigation: React.FC = () => {
  const { currentStep } = useCampaign();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-12">
        <StepIndicator 
          number={1} 
          title="Website Analysis" 
          active={currentStep === 1} 
          completed={currentStep > 1} 
        />
        <StepIndicator 
          number={2} 
          title="Campaign Setup" 
          active={currentStep === 2} 
          completed={currentStep > 2} 
        />
        <StepIndicator 
          number={3} 
          title="Ad Generation" 
          active={currentStep === 3} 
          completed={currentStep > 3} 
        />
      </div>
    </div>
  );
};

export default StepNavigation;
