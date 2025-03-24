
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  current?: number;
  currentStep?: number; // Add this prop for compatibility
  total?: number;
  totalSteps?: number; // Add this prop for compatibility
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  current,
  currentStep,
  total,
  totalSteps,
  onBack,
  onNext,
  isNextDisabled = false,
}) => {
  // Use either current or currentStep, prioritizing current if both are provided
  const activeStep = current || currentStep || 1;
  const totalStep = total || totalSteps || 5;
  
  const isFirstStep = activeStep === 1;
  const isLastStep = activeStep === totalStep;

  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className="flex items-center gap-1"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="text-sm text-muted-foreground">
        Step {activeStep} of {totalStep}
      </div>

      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className="flex items-center gap-1"
      >
        {isLastStep ? "Finish" : "Next"}
        {!isLastStep && <ArrowRight size={16} />}
      </Button>
    </div>
  );
};

export default StepNavigation;
