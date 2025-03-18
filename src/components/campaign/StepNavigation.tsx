
import React from "react";
import { Card } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";

interface StepNavigationProps {
  currentStep?: number;
  totalSteps?: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep = 1,
  totalSteps = 4 // Updated to 4 steps
}) => {
  const steps = [
    { number: 1, label: "Website Analysis" },
    { number: 2, label: "Campaign Setup" },
    { number: 3, label: "Ad Creation" },
    { number: 4, label: "Review & Launch" } // New summary step
  ];

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap justify-between">
        {steps.slice(0, totalSteps).map((step) => (
          <StepIndicator
            key={step.number}
            number={step.number}
            label={step.label}
            isActive={currentStep === step.number}
            isCompleted={currentStep > step.number}
          />
        ))}
      </div>
    </Card>
  );
};

export default StepNavigation;
