
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStepIndex: number;
  onStepClick: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStepIndex, 
  onStepClick 
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {steps.map((title, index) => (
          <button
            key={index}
            onClick={() => onStepClick(index + 1)}
            disabled={index + 1 > currentStepIndex}
            className={cn(
              "flex items-center text-left group",
              index + 1 > currentStepIndex ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
          >
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center mr-3 transition-all duration-200",
                currentStepIndex === index + 1 ? "bg-primary text-primary-foreground ring-2 ring-primary/20 ring-offset-2" : "",
                currentStepIndex > index + 1 ? "bg-green-600 text-white" : "",
                currentStepIndex !== index + 1 && currentStepIndex <= index + 1 ? "border-2 border-muted-foreground/30 text-muted-foreground" : ""
              )}
            >
              {currentStepIndex > index + 1 ? <Check size={20} /> : index + 1}
            </div>
            <span className={cn(
              "transition-colors",
              currentStepIndex === index + 1 ? "font-semibold text-primary" : "",
              currentStepIndex > index + 1 ? "font-medium text-green-600" : "",
              currentStepIndex !== index + 1 && currentStepIndex <= index + 1 ? "text-muted-foreground" : ""
            )}>
              {title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
