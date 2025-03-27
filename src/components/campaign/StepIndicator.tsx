
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
    <div className="flex items-center group mb-4">
      <div 
        className={`flex items-center justify-center h-9 w-9 rounded-full transition-colors ${
          isCompleted ? "bg-success text-success-foreground" : 
          isActive ? "bg-primary text-primary-foreground" : 
          "bg-muted text-muted-foreground"
        }`}
      >
        {isCompleted ? <Check className="h-5 w-5" /> : icon}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium transition-colors ${
          isActive ? "text-primary" : 
          isCompleted ? "text-success" : 
          "text-muted-foreground"
        }`}>
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
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <h3 className="text-base font-semibold mb-5 text-foreground">Campaign Progress</h3>
      
      <div className="space-y-1">
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
      
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center">
          <div className="h-2 bg-muted rounded-full flex-1">
            <div 
              className="h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${Math.min(100, (currentStep / 7) * 100)}%` }}
            />
          </div>
          <span className="ml-3 text-xs font-medium text-muted-foreground">
            Step {currentStep} of 7
          </span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
