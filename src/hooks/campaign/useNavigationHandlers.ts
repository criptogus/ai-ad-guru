
import { useState } from "react";

export const useNavigationHandlers = (
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [autoAdvance, setAutoAdvance] = useState(false);

  const handleBack = () => {
    window.scrollTo(0, 0);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (data?: any) => {
    window.scrollTo(0, 0);
    
    // If data is provided, update the campaign data
    if (data) {
      setCampaignData((prev: any) => ({
        ...prev,
        ...data,
      }));
      
      // Only advance to the next step if autoAdvance is true or if no autoAdvance flag is passed
      if (autoAdvance) {
        setCurrentStep((prev) => prev + 1);
        return true;
      }
    } else {
      // If no data is provided, just advance to the next step
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    
    return false;
  };

  return {
    handleBack,
    handleNext,
    autoAdvance,
    setAutoAdvance
  };
};

export default useNavigationHandlers;
