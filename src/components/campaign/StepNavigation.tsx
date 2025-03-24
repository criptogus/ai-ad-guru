
import React from "react";
import { Button } from "@/components/ui/button";

export interface StepNavigationProps {
  current?: number;
  currentStep?: number;
  total?: number;
  totalSteps?: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  current,
  currentStep,
  total = 5,
  totalSteps = 5,
  onBack,
  onNext,
  isNextDisabled = false,
  isBackDisabled = false,
}) => {
  // Use either current or currentStep, prioritizing current if both are provided
  const activeStep = current ?? currentStep ?? 1;
  // Use either total or totalSteps, prioritizing total if both are provided
  const totalStepsCount = total ?? totalSteps ?? 5;
  
  return (
    <div className="flex justify-between items-center border-t pt-4 mt-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isBackDisabled}
      >
        Back
      </Button>
      <div className="text-sm text-muted-foreground">
        Step {activeStep} of {totalStepsCount}
      </div>
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
      >
        {activeStep === totalStepsCount ? "Finish" : "Next"}
      </Button>
    </div>
  );
};

export default StepNavigation;
