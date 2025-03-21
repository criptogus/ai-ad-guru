
// Function to get credit cost for different actions
export const getCreditCosts = () => {
  return {
    campaignCreation: 5,
    aiOptimization: {
      daily: 10,
      every3Days: 5,
      weekly: 2
    },
    imageGeneration: 5,
    metaAdGeneration: 5  // Adding Meta/Instagram ad generation cost
  };
};
