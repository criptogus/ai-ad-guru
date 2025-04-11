
import { useState } from 'react';

export const useNavigationHandlers = (
  currentStep: number,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [autoAdvance, setAutoAdvance] = useState(false);

  const handleBack = () => {
    if (currentStep > 1) {
      console.log(`Navigating back from step ${currentStep} to ${currentStep - 1}`);
      setCurrentStep(currentStep - 1);
      // Scroll to top when going back
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = (data?: any) => {
    console.log("handleNext called from step", currentStep, "with data", data);
    
    if (data) {
      // Update the data without navigating
      setCampaignData((prev: any) => ({ ...prev, ...data }));
      console.log("Updated campaign data with:", data);
      
      // Only advance if autoAdvance is true
      if (autoAdvance) {
        console.log(`Auto-advancing from step ${currentStep} to ${currentStep + 1}`);
        setCurrentStep(currentStep + 1);
        // Scroll to top when advancing
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      
      return;
    }
    
    // No data provided, explicit navigation request
    console.log(`Explicitly navigating from step ${currentStep} to ${currentStep + 1}`);
    setCurrentStep(currentStep + 1);
    // Scroll to top when advancing
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    handleBack,
    handleNext,
    autoAdvance,
    setAutoAdvance
  };
};
