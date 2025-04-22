
import React from "react";
import { Card } from "@/components/ui/card";
import { Stepper } from "@/components/campaign/Stepper";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { CreateCampaignStepperContent } from "@/components/campaign/CreateCampaignStepperContent";
import { useCampaignPageController } from "@/hooks/campaign/useCampaignPageController";

const CreateCampaignPage: React.FC = () => {
  const {
    currentStep,
    stepRenderer,
    analysisResult,
    campaignData
  } = useCampaignPageController();

  return (
    <CampaignProvider>
      <AppLayout activePage="campaigns">
        <div className="container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
          </div>
          <Stepper currentStep={currentStep} />
          <Card>
            <CreateCampaignStepperContent
              currentStep={currentStep}
              stepRenderer={stepRenderer}
              analysisResult={analysisResult}
              campaignData={campaignData}
            />
          </Card>
        </div>
      </AppLayout>
    </CampaignProvider>
  );
};

export default CreateCampaignPage;
