
/**
 * Credit costs for various actions
 */
export const CREDIT_COSTS = {
  'textAd': 1,
  'imageAd': 3,
  'googleAds': 5,
  'metaAds': 5,
  'linkedInAds': 5,
  'microsoftAds': 5,
  'siteAnalysis': 5,
  'audienceAnalysis': 5,
  'imageGeneration': 3,
  'smartBanner': 3,
  'adOptimization.daily': 2,
  'adOptimization.weekly': 5,
  'adOptimization.monthly': 10,
  'campaignOptimizationDaily': 2,
  'campaignOptimizationWeekly': 5,
  'campaignOptimizationMonthly': 10
};

/**
 * Get credit cost for a specific action
 */
export const getCreditCost = (action: string): number => {
  return CREDIT_COSTS[action] || 0;
};

/**
 * Calculate total credit cost for multiple actions
 */
export const calculateTotalCreditCost = (actions: { action: string, quantity: number }[]): number => {
  return actions.reduce((total, current) => {
    return total + (getCreditCost(current.action) * current.quantity);
  }, 0);
};
