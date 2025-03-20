
export interface WebsiteAnalysisResult {
  companyName: string;
  businessDescription?: string;
  targetAudience?: string;
  brandTone?: string;
  keywords?: string[] | string;
  callToAction?: string[] | string;
  uniqueSellingPoints?: string[] | string;
  websiteUrl?: string;
}

export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
}

export interface LinkedInAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
}

export interface MicrosoftAd {
  headlines: string[];
  descriptions: string[];
}
