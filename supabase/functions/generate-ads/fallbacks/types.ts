
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  headlines: string[];
  descriptions: string[];
  finalUrl?: string;
  path1: string;
  path2: string;
  displayPath?: string;
  // Update siteLinks to include link property
  siteLinks?: {title: string, link: string, description?: string}[];
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: "feed" | "story" | "reel";
  hashtags?: string[] | string;
}

// Define LinkedIn ads as a MetaAd for now for simplicity
export interface LinkedInAd extends MetaAd {}

// Define Microsoft ads as a GoogleAd for now for simplicity
export interface MicrosoftAd extends GoogleAd {}

export interface WebsiteAnalysisResult {
  companyName: string;
  websiteUrl: string;
  businessDescription: string;
  targetAudience: string;
  uniqueSellingPoints: string[] | string;
  callToAction: string[] | string;
  keywords: string[] | string;
  brandTone?: string;
}
