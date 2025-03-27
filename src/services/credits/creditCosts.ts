
import { AllCreditCosts, CreditAction, OptimizationCosts } from "../types";

// Define the credit cost for each action
export const getCreditCost = (action: CreditAction): number => {
  const costs = getCreditCosts();

  switch (action) {
    case 'google_ad_creation':
      return costs.googleAdCreation;
    case 'meta_ad_creation':
      return costs.metaAdCreation;
    case 'linkedin_ad_creation':
      return costs.linkedInAdCreation;
    case 'microsoft_ad_creation':
      return costs.microsoftAdCreation;
    case 'image_generation':
      return costs.imageGeneration;
    case 'website_analysis':
      return costs.websiteAnalysis;
    case 'campaign_creation':
      return costs.campaignCreation;
    case 'ai_insights_report':
      return costs.aiInsightsReport;
    case 'smart_banner_creation':
      return costs.smartBannerCreation;
    case 'ai_optimization_daily':
      return (costs.optimization as OptimizationCosts).daily;
    case 'ai_optimization_3days':
      return (costs.optimization as OptimizationCosts).threeDays;
    case 'ai_optimization_weekly':
      return (costs.optimization as OptimizationCosts).weekly;
    case 'credit_purchase':
    case 'credit_refund':
      return 0; // These don't cost credits
    default:
      return 0;
  }
};

// Get all credit costs
export const getCreditCosts = (): AllCreditCosts => {
  return {
    googleAdCreation: 5,
    metaAdCreation: 5,
    linkedInAdCreation: 5,
    microsoftAdCreation: 5,
    imageGeneration: 2,
    websiteAnalysis: 1,
    campaignCreation: 2,
    aiInsightsReport: 3,
    smartBannerCreation: 5,
    optimization: {
      daily: 10,
      threeDays: 5,
      weekly: 2
    }
  };
};

// For backward compatibility
export { getCreditCosts as getAiOptimizationCosts };
