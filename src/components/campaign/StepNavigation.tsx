
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";

interface StepNavigationProps {
  currentStep?: number;
  totalSteps?: number;
  onBack?: () => void;
  onNext?: () => void;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  currentStep = 1,
  totalSteps = 5,
  onBack,
  onNext,
  isNextDisabled = false
}) => {
  const steps = [
    { number: 1, title: "Website Analysis" },
    { number: 2, title: "Choose Platforms" },
    { number: 3, title: "Campaign Setup" },
    { number: 4, title: "Ad Creation" },
    { number: 5, title: "Review & Launch" }
  ];

  return (
    <Card className="p-6 mb-6 shadow-md border-accent/20">
      <div className="flex flex-wrap justify-between mb-6">
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
      
      {(onBack || onNext) && (
        <div className="flex justify-between pt-4 border-t">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext} disabled={isNextDisabled}>
              Next Step
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default StepNavigation;
