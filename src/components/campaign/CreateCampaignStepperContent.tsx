
import React from "react";
import { CardContent } from "@/components/ui/card";
import { AdGenerationStep } from "@/components/campaign/AdGenerationStep";

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
  // Custom rendering for step 4 (ad generation)
  if (currentStep === 4) {
    return (
      <CardContent className="p-0">
        <AdGenerationStep
          analysisResult={analysisResult}
          campaignData={campaignData}
          onAdsGenerated={() => {}} // this will be supplied by the main file if needed
          platforms={campaignData.platforms || []}
        />
      </CardContent>
    );
  }
  // Standard step rendering
  return (
    <CardContent className="p-0">
      {stepRenderer.getStepContent()}
    </CardContent>
  );
};
