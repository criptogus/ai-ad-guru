import { CreditAction } from './types';

/**
 * Credit costs for different actions in the application
 */
export const CREDIT_COSTS: Record<CreditAction, number> = {
  // Ad creation
  googleAds: 5,
  metaAds: 5,
  linkedinAds: 7,
  microsoftAds: 5,
  
  // Image generation
  imageGeneration: 3,
  smartBanner: 5,
  
  // AI optimization
  'adOptimization.daily': 10,
  'adOptimization.weekly': 5,
  'adOptimization.monthly': 2,
  
  // Other actions
  campaignAnalysis: 8,
  websiteAnalysis: 5,
  exportReport: 2,
  
  // Purchases
  creditPurchase: 0
};

/**
 * Get the credit cost for a specific action
 */
export const getCreditCost = (action: CreditAction): number => {
  return CREDIT_COSTS[action] || 0;
};

/**
 * Check if user has enough credits for an action
 */
export const hasEnoughCredits = (userCredits: number, action: CreditAction): boolean => {
  const cost = getCreditCost(action);
  return userCredits >= cost;
};

/**
 * Calculate total credits needed for multiple actions
 */
export const calculateTotalCreditCost = (actions: CreditAction[]): number => {
  return actions.reduce((total, action) => total + getCreditCost(action), 0);
};
