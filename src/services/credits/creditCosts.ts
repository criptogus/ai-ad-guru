
// Define credit costs for different actions in the application

export interface CreditCosts {
  // Ad Generation
  googleAdGeneration: number;
  metaAdGeneration: number;
  microsoftAdGeneration: number;
  linkedInAdGeneration: number;
  
  // Image Generation
  imageGeneration: number;
  smartBanner: number;
  
  // Campaign Creation
  campaignCreation: number;
  
  // Optimization
  adOptimization: number;
  aiOptimization: {
    daily: number;
    every3Days: number;
    weekly: number;
  };
  
  // Reports and Analysis
  adPerformanceAnalysis: number;
  weeklyReport: number;
}

// Get the credit costs for different actions
export const getCreditCosts = (): CreditCosts => {
  return {
    // Ad Generation
    googleAdGeneration: 5, // Cost for generating Google Search Ads (5 variations)
    metaAdGeneration: 5, // Cost for generating Meta/Instagram Ads
    microsoftAdGeneration: 5, // Cost for generating Microsoft Ads
    linkedInAdGeneration: 5, // Cost for generating LinkedIn Ads
    
    // Image Generation
    imageGeneration: 5, // Cost for generating one ad image
    smartBanner: 5, // Cost for generating a smart banner
    
    // Campaign Creation
    campaignCreation: 5, // Cost for creating a campaign
    
    // Optimization
    adOptimization: 10, // Legacy cost for AI optimization of ads
    aiOptimization: {
      daily: 10, // Cost for daily optimization
      every3Days: 5, // Cost for optimization every 3 days
      weekly: 2, // Cost for weekly optimization
    },
    
    // Reports and Analysis
    adPerformanceAnalysis: 5, // Cost for analyzing ad performance
    weeklyReport: 2, // Cost for weekly reports
  };
};

// Export a function to get the cost for a specific action
export const getCostForAction = (action: keyof CreditCosts): number => {
  const costs = getCreditCosts();
  
  // Handle nested properties
  if (action === 'aiOptimization') {
    return costs.aiOptimization.daily; // Return the daily cost by default
  }
  
  return costs[action] || 0;
};
