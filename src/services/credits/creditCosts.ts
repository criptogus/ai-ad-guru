/**
 * Credit Cost Configuration
 * Defines the cost of various actions in the application
 */

import { CreditAction, CreditCosts } from './types';

// Default credit costs for different features
export const creditCosts: Record<CreditAction, number> = {
  // Main platform costs
  googleAds: 5,               // Cost to generate Google Ads
  metaAds: 5,                 // Cost to generate Meta Ads (including image)
  linkedInAds: 5,             // Cost to generate LinkedIn Ads
  microsoftAds: 5,            // Cost to generate Microsoft Ads
  
  // Feature costs
  imageGeneration: 3,         // Cost to generate a single image
  websiteAnalysis: 2,         // Cost to analyze a website
  aiInsightsReport: 10,       // Cost to generate an AI insights report
  
  // Legacy action names (keeping for backward compatibility)
  campaign_creation: 5,       // Cost to create a campaign
  image_generation: 3,        // Legacy name for image generation
  smart_banner: 5,            // Cost for smart banner creation
  
  // Optimization costs
  'adOptimization.daily': 10,     // Cost for daily optimization
  'adOptimization.every3Days': 5, // Cost for optimization every 3 days
  'adOptimization.weekly': 2      // Cost for weekly optimization
};

/**
 * Get credit cost for a specific feature
 */
export const getCreditCost = (feature: CreditAction): number => {
  return creditCosts[feature] || 0;
};

/**
 * Get all credit costs in a structured format
 */
export const getAllCreditCosts = (): CreditCosts => {
  return {
    campaignCreation: creditCosts.campaign_creation,
    googleAds: creditCosts.googleAds,
    metaAds: creditCosts.metaAds,
    linkedInAds: creditCosts.linkedInAds,
    microsoftAds: creditCosts.microsoftAds,
    imageGeneration: creditCosts.imageGeneration,
    websiteAnalysis: creditCosts.websiteAnalysis,
    aiInsightsReport: creditCosts.aiInsightsReport,
    adOptimization: {
      daily: creditCosts['adOptimization.daily'],
      every3Days: creditCosts['adOptimization.every3Days'],
      weekly: creditCosts['adOptimization.weekly']
    }
  };
};

/**
 * Alias for getAllCreditCosts for backward compatibility
 */
export const getCreditCosts = getAllCreditCosts;

/**
 * Calculate the total cost for a campaign based on selected platforms and options
 */
export const calculateCampaignCost = (
  platforms: Array<'google' | 'meta' | 'linkedin' | 'microsoft'>,
  includeImageGeneration: boolean = false,
  includeWebsiteAnalysis: boolean = false
): number => {
  let totalCost = 0;
  
  // Add platform costs
  for (const platform of platforms) {
    switch (platform) {
      case 'google':
        totalCost += creditCosts.googleAds;
        break;
      case 'meta':
        totalCost += creditCosts.metaAds;
        break;
      case 'linkedin':
        totalCost += creditCosts.linkedInAds;
        break;
      case 'microsoft':
        totalCost += creditCosts.microsoftAds;
        break;
    }
  }
  
  // Add optional features
  if (includeImageGeneration) {
    totalCost += creditCosts.imageGeneration;
  }
  
  if (includeWebsiteAnalysis) {
    totalCost += creditCosts.websiteAnalysis;
  }
  
  return totalCost;
};

export default creditCosts;
