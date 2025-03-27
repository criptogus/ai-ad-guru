
export interface CreditCosts {
  googleAds: number;
  metaAds: number;
  linkedinAds: number;
  microsoftAds: number;
  campaignCreation: number;
  websiteAnalysis: number;
  imageGeneration: number;
  aiInsightsReport: number;
  smartBanner: number;
  aiOptimization: {
    daily: number;
    every3Days: number;
    weekly: number;
  };
}

export const getCreditCosts = (): CreditCosts => {
  return {
    googleAds: 5,
    metaAds: 10,
    linkedinAds: 8,
    microsoftAds: 5,
    campaignCreation: 2,
    websiteAnalysis: 3,
    imageGeneration: 5,
    aiInsightsReport: 15,
    smartBanner: 5,
    aiOptimization: {
      daily: 10,
      every3Days: 5,
      weekly: 2,
    }
  };
};
