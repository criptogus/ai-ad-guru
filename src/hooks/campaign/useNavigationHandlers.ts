
import { useState } from 'react';

export const useNavigationHandlers = (
  currentStep: number,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [autoAdvance, setAutoAdvance] = useState(true);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = (data?: any) => {
    if (data) {
      setCampaignData((prev: any) => ({ ...prev, ...data }));
    }
    
    setCurrentStep(currentStep + 1);
  };

  return {
    handleBack,
    handleNext,
    autoAdvance,
    setAutoAdvance
  };
};
