
import { CreditAction } from "../types";

interface CreditCosts {
  [key: string]: number;
}

interface OptimizationCosts {
  daily: number;
  threeDays: number;
  weekly: number;
}

export interface AllCreditCosts extends CreditCosts {
  aiOptimization: OptimizationCosts;
}

// Credit costs for different actions
export const getCreditCosts = (): AllCreditCosts => ({
  google_ad_creation: 5,
  meta_ad_creation: 5,
  linkedin_ad_creation: 5,
  microsoft_ad_creation: 5,
  image_generation: 1,
  website_analysis: 1,
  campaign_creation: 0,
  ai_insights_report: 3,
  smart_banner_creation: 2,
  aiOptimization: {
    daily: 10,
    threeDays: 5,
    weekly: 2
  }
});

// Helper to get cost for a specific action
export const getCostForAction = (action: CreditAction): number => {
  const costs = getCreditCosts();
  
  // Handle special case for optimization actions
  if (action === 'ai_optimization_daily') return costs.aiOptimization.daily;
  if (action === 'ai_optimization_3days') return costs.aiOptimization.threeDays;
  if (action === 'ai_optimization_weekly') return costs.aiOptimization.weekly;
  
  return costs[action] || 0;
};
