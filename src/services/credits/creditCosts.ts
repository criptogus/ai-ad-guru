
// Define credit costs for different actions in the application

export interface CreditCosts {
  googleAdGeneration: number;
  metaAdGeneration: number;
  microsoftAdGeneration: number;
  linkedInAdGeneration: number;
  imageGeneration: number;
  adOptimization: number;
  adPerformanceAnalysis: number;
  weeklyReport: number;
}

// Get the credit costs for different actions
export const getCreditCosts = (): CreditCosts => {
  return {
    googleAdGeneration: 5, // Cost for generating Google Search Ads (5 variations)
    metaAdGeneration: 5, // Cost for generating Meta/Instagram Ads
    microsoftAdGeneration: 5, // Cost for generating Microsoft Ads
    linkedInAdGeneration: 5, // Cost for generating LinkedIn Ads
    imageGeneration: 5, // Cost for generating one ad image
    adOptimization: 10, // Cost for AI optimization of ads (daily)
    adPerformanceAnalysis: 5, // Cost for analyzing ad performance
    weeklyReport: 2, // Cost for weekly reports
  };
};

// Export a function to get the cost for a specific action
export const getCostForAction = (action: keyof CreditCosts): number => {
  const costs = getCreditCosts();
  return costs[action] || 0;
};
