
export const useNavigationHandlers = (
  setCurrentStep: (updater: (prev: number) => number) => void,
  setCampaignData: (updater: (prev: any) => any) => void
) => {
  const handleNext = (data?: any) => {
    if (data) {
      setCampaignData(prev => ({
        ...prev,
        ...data
      }));
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return {
    handleNext,
    handleBack
  };
};
