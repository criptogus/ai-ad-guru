
import { AllCreditCosts, OptimizationCosts } from "../types";

// Define optimization costs
const optimizationCosts: OptimizationCosts = {
  daily: 10,
  threeDays: 5,
  weekly: 2
};

// Define credit costs for different actions
export const creditCosts: AllCreditCosts = {
  google_ad_creation: 5,
  meta_ad_creation: 5,
  linkedin_ad_creation: 5,
  microsoft_ad_creation: 5,
  image_generation: 3,
  website_analysis: 2,
  campaign_creation: 1,
  ai_insights_report: 3,
  smart_banner_creation: 3,
  ai_optimization_daily: optimizationCosts.daily,
  ai_optimization_3days: optimizationCosts.threeDays,
  ai_optimization_weekly: optimizationCosts.weekly,
};

// Get credit cost for an action
export const getCreditCost = (action: string): number => {
  if (action.startsWith('ai_optimization_')) {
    const frequency = action.replace('ai_optimization_', '');
    if (frequency === 'daily') return optimizationCosts.daily;
    if (frequency === '3days') return optimizationCosts.threeDays;
    if (frequency === 'weekly') return optimizationCosts.weekly;
    return 0;
  }
  
  return (creditCosts as Record<string, number>)[action] || 0;
};

// Get all credit costs
export const getAllCreditCosts = (): AllCreditCosts => {
  return {
    ...creditCosts,
    optimization: optimizationCosts
  };
};

// Get optimization costs
export const getOptimizationCosts = (): OptimizationCosts => {
  return optimizationCosts;
};
