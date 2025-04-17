
import { CreditAction } from './types';

/**
 * Credit costs for various actions
 */
export const CREDIT_COSTS: Record<CreditAction, number> = {
  // Text ad generation
  textAd: 1,
  googleAds: 5,
  microsoftAds: 5,
  
  // Image ad generation
  imageAd: 3,
  metaAds: 5,
  linkedInAds: 8,
  
  // Other services
  siteAnalysis: 2,
  audienceAnalysis: 3,
  imageGeneration: 5,
  smartBanner: 3,
  
  // Optimization costs
  'adOptimization.daily': 10,
  'adOptimization.weekly': 5,
  'adOptimization.monthly': 2,
  campaignOptimizationDaily: 15,
  campaignOptimizationWeekly: 8,
  campaignOptimizationMonthly: 3
};

/**
 * Get credit cost for an action
 */
export const getCreditCost = (action: CreditAction): number => {
  return CREDIT_COSTS[action] || 0;
};

/**
 * Get all credit costs
 */
export const getAllCreditCosts = (): Record<CreditAction, number> => {
  return { ...CREDIT_COSTS };
};

/**
 * Calculate total credit cost for multiple actions
 */
export const calculateTotalCreditCost = (actions: CreditAction[]): number => {
  return actions.reduce((total, action) => total + getCreditCost(action), 0);
};
