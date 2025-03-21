
import React from "react";
import { Card } from "@/components/ui/card";
import StepIndicator from "./StepIndicator";

interface StepNavigationProps {
  currentStep?: number;
  totalSteps?: number;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep = 1,
  totalSteps = 5 // Updated from 4 to 5
}) => {
  const steps = [
    { number: 1, title: "Website Analysis" },
    { number: 2, title: "Choose Platforms" }, // Added new step
    { number: 3, title: "Campaign Setup" },
    { number: 4, title: "Ad Creation" },
    { number: 5, title: "Review & Launch" }
  ];

  return (
    <Card className="p-6 mb-6 shadow-md border-accent/20">
      <div className="flex flex-wrap justify-between">
        {steps.slice(0, totalSteps).map((step) => (
          <StepIndicator
            key={step.number}
            number={step.number}
            title={step.title}
            active={currentStep === step.number}
            completed={currentStep > step.number}
          />
        ))}
      </div>
    </Card>
  );
};

export default StepNavigation;
