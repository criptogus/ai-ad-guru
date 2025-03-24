
import { useCallback } from "react";

interface UseStepNavigationProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  campaignData: any;
}

export const useStepNavigation = ({
  currentStep,
  setCurrentStep,
  setCampaignData,
  campaignData
}: UseStepNavigationProps) => {
  
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, setCurrentStep]);

  const handleNextWrapper = useCallback((data?: any) => {
    if (data) {
      setCampaignData({ ...campaignData, ...data });
    }
    handleNext();
  }, [campaignData, setCampaignData, handleNext]);

  return {
    handleBack,
    handleNext,
    handleNextWrapper
  };
};
