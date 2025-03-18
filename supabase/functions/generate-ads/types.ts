
// Type definitions for ad generation

export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
}

export interface MetaAd {
  primaryText: string;
  headline: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string; // Added after image generation
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
