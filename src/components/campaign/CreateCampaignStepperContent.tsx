
import React from "react";
import { CardContent } from "@/components/ui/card";

interface StepperContentProps {
  currentStep: number;
  stepRenderer: { getStepContent: () => React.ReactNode };
  analysisResult: any;
  campaignData: any;
}

export const CreateCampaignStepperContent: React.FC<StepperContentProps> = ({
  currentStep,
  stepRenderer,
  analysisResult,
  campaignData
}) => {
  // Always use the step renderer to get the appropriate content
  return (
    <CardContent className="p-0">
      {stepRenderer.getStepContent()}
    </CardContent>
  );
};
