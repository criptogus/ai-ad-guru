
import React from "react";

interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
  onStepClick?: (stepId: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  steps, 
  onStepClick 
}) => {
  return (
    <div className="w-full">
      {/* Steps indicators */}
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick && onStepClick(step.id)}
                disabled={step.id > currentStep}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  currentStep > step.id
                    ? "bg-primary text-white" 
                    : currentStep === step.id 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                } ${onStepClick ? "cursor-pointer" : "cursor-default"}`}
              >
                {currentStep > step.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                ) : (
                  step.id
                )}
              </button>
            </div>
            
            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Step labels */}
      <div className="hidden sm:grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
        {steps.map(step => (
          <div key={`label-${step.id}`} className="text-center text-xs">
            {step.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
