/**
 * Credit costs for various actions in the platform
 */
export const CREDIT_COSTS: Record<CreditAction, number> = {
  // Ad creation costs
  googleAds: 5,
  metaAds: 5,
  linkedinAds: 7,
  microsoftAds: 5,
  
  // Image generation costs
  imageGeneration: 3,
  smartBanner: 5,
  
  // AI optimization costs
  'adOptimization.daily': 10,
  'adOptimization.weekly': 7,
  'adOptimization.monthly': 5,
  
  // Other actions
  campaignAnalysis: 2,
  websiteAnalysis: 1,
  exportReport: 1,
  
  // Purchases (negative values, these add credits)
  creditPurchase: -1 // This is a multiplier, actual value set during purchase
};

/**
 * Get the credit cost for a specific action
 */
export const getCreditCost = (action: CreditAction | string): number => {
  return CREDIT_COSTS[action as CreditAction] || 0;
};

import { CreditAction } from './types';
