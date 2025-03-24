
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
  current: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  current,
  total,
  onBack,
  onNext,
  isNextDisabled = false,
}) => {
  const isFirstStep = current === 1;
  const isLastStep = current === total;

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
        Step {current} of {total}
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
