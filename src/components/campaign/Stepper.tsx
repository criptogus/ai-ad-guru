
import React from "react";

interface StepperProps {
  currentStep: number;
  totalSteps?: number;
}

export const Stepper: React.FC<StepperProps> = ({ 
  currentStep, 
  totalSteps = 7 
}) => {
  return (
    <div className="w-full">
      {/* Steps indicators */}
      <div className="flex items-center justify-between mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep > index + 1 
                  ? "bg-primary text-white" 
                  : currentStep === index + 1 
                  ? "bg-primary text-white" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {currentStep > index + 1 ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {/* Connector line between steps */}
            {index < totalSteps - 1 && (
              <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 flex-grow mx-2"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Step labels */}
      <div className="hidden sm:grid grid-cols-7 text-xs">
        <div className="text-center">Website</div>
        <div className="text-center">Platforms</div>
        <div className="text-center">Triggers</div>
        <div className="text-center">Audience</div>
        <div className="text-center">Setup</div>
        <div className="text-center">Preview</div>
        <div className="text-center">Summary</div>
      </div>
    </div>
  );
};
