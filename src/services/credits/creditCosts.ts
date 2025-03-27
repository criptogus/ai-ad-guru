
// Define cost structure 
export interface OptimizationCosts {
  daily: number;
  every3Days: number;
  weekly: number;
}

// Define credit costs for various operations
export const creditCosts = {
  googleAds: 5, // 5 credits for Google Ad generation
  metaAds: 5, // 5 credits for Meta/Instagram Ad generation
  linkedInAds: 5, // 5 credits for LinkedIn Ad generation
  microsoftAds: 5, // 5 credits for Microsoft Ad generation
  imageGeneration: 2, // 2 credits per image generation
  websiteAnalysis: 1, // 1 credit for website analysis
  adOptimization: {
    daily: 10,
    every3Days: 5,
    weekly: 2
  } as OptimizationCosts, // Credits for different optimization frequencies
  campaignCreation: 5, // 5 credits to finalize and launch a campaign
  bannerCreation: 3 // 3 credits to create a smart banner
};

// Export a function to get all credit costs
export const getAllCreditCosts = () => {
  return creditCosts;
};

// Export individual cost getters
export const getGoogleAdsCost = () => creditCosts.googleAds;
export const getMetaAdsCost = () => creditCosts.metaAds;
export const getLinkedInAdsCost = () => creditCosts.linkedInAds;
export const getMicrosoftAdsCost = () => creditCosts.microsoftAds;
export const getImageGenerationCost = () => creditCosts.imageGeneration;
export const getWebsiteAnalysisCost = () => creditCosts.websiteAnalysis;
export const getAdOptimizationCost = () => creditCosts.adOptimization;
export const getCampaignCreationCost = () => creditCosts.campaignCreation;
export const getBannerCreationCost = () => creditCosts.bannerCreation;
