
// Type definitions for ad generation

export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
}

export interface LinkedInAd {
  headline: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface MicrosoftAd {
  headlines: string[];
  descriptions: string[];
}

// Copied from /src/hooks/useWebsiteAnalysis.ts to avoid import issues
export interface WebsiteAnalysisResult {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
  websiteUrl?: string;
}
