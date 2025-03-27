
import React from "react";
import { Check, MessageSquare, Target, CalendarClock, PanelLeft, PenTool, BarChart } from "lucide-react";

interface StepProps {
  stepNumber: number;
  currentStep: number;
  title: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ stepNumber, currentStep, title, icon }) => {
  const isCompleted = currentStep > stepNumber;
  const isActive = currentStep === stepNumber;

  return (
    <div className="flex items-center">
      <div 
        className={`flex items-center justify-center h-8 w-8 rounded-full ${
          isCompleted ? "bg-green-500" : isActive ? "bg-primary" : "bg-muted"
        } text-white`}
      >
        {isCompleted ? <Check className="h-4 w-4" /> : icon}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {title}
        </p>
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="hidden sm:flex flex-col space-y-6 w-1/4">
        <Step
          stepNumber={1}
          currentStep={currentStep}
          title="Website Analysis"
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <Step
          stepNumber={2}
          currentStep={currentStep}
          title="Platform Selection"
          icon={<Target className="h-4 w-4" />}
        />
        <Step
          stepNumber={3}
          currentStep={currentStep}
          title="Mind Triggers"
          icon={<PanelLeft className="h-4 w-4" />}
        />
        <Step
          stepNumber={4}
          currentStep={currentStep}
          title="Audience Analysis"
          icon={<BarChart className="h-4 w-4" />}
        />
      </div>
      <div className="hidden sm:flex flex-col space-y-6 w-1/4">
        <Step
          stepNumber={5}
          currentStep={currentStep}
          title="Campaign Setup"
          icon={<CalendarClock className="h-4 w-4" />}
        />
        <Step
          stepNumber={6}
          currentStep={currentStep}
          title="Ad Preview"
          icon={<PenTool className="h-4 w-4" />}
        />
        <Step
          stepNumber={7}
          currentStep={currentStep}
          title="Review & Launch"
          icon={<Check className="h-4 w-4" />}
        />
      </div>
      <div className="sm:hidden flex items-center justify-center w-full">
        <p className="text-sm font-medium">
          Step {currentStep} of 7
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
