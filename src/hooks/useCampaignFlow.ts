
import { useCampaignSteps } from "@/hooks/useCampaignSteps";

export const useCampaignFlow = (
  currentStep: number,
  setCurrentStep: (step: number) => void,
  analysisResult: any,
  campaignData: any,
  user: any,
  createCampaign: () => void
) => {
  // Campaign step navigation
  const { handleBack, handleNext } = useCampaignSteps(
    currentStep, 
    setCurrentStep, 
    analysisResult, 
    campaignData, 
    user
  );

  // Wrapper for next button to create campaign when needed
  const handleNextWrapper = () => {
    const shouldCreateCampaign = handleNext();
    if (shouldCreateCampaign && currentStep === 3) {
      createCampaign();
    }
  };

  return {
    handleBack,
    handleNextWrapper
  };
};
