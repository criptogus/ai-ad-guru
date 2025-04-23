
import React from "react";

interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps?: Step[];
  onStepClick?: (stepId: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep,
  steps = [
    { id: 1, name: "Gerar" },
    { id: 2, name: "Revisar" },
    { id: 3, name: "Publicar" }
  ],
  onStepClick
}) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step circle */}
          <div 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onStepClick?.(step.id)}
          >
            <div 
              className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2
                ${currentStep === step.id 
                  ? 'bg-primary text-white border-primary' 
                  : currentStep > step.id
                    ? 'bg-primary/80 text-white border-primary/80'
                    : 'bg-background border-gray-300 text-gray-500'
                }
              `}
            >
              {currentStep > step.id ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <span 
              className={`mt-2 text-xs font-medium ${
                currentStep >= step.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'
              }`}
            >
              {step.name}
            </span>
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div 
              className={`flex-1 h-0.5 mx-2 ${
                currentStep > index + 1 ? 'bg-primary/80' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
