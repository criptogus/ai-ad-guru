
import { useState } from 'react';

export const useNavigationHandlers = (
  currentStep: number,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [autoAdvance, setAutoAdvance] = useState(false); // Changed to false by default

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when going back
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = (data?: any) => {
    console.log("handleNext called from step", currentStep, "with data", data);
    
    if (data) {
      // Only update the data without navigating
      setCampaignData((prev: any) => ({ ...prev, ...data }));
      console.log("Updated campaign data with:", data);
      
      // Only advance if autoAdvance is true
      if (autoAdvance) {
        setCurrentStep(currentStep + 1);
        // Scroll to top when advancing
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      
      return;
    }
    
    // No data provided, explicit navigation request
    setCurrentStep(currentStep + 1);
    // Scroll to top when advancing
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("Advancing to step:", currentStep + 1);
  };

  return {
    handleBack,
    handleNext,
    autoAdvance,
    setAutoAdvance
  };
};
