
export interface WebsiteAnalysisResult {
  companyName?: string;
  businessDescription?: string;
  industry?: string;
  targetAudience?: string;
  brandTone?: string;
  keywords?: string[];
  callToAction?: string[] | string;
  uniqueSellingPoints?: string[];
  websiteUrl?: string;
  [key: string]: any;
}

export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  path1: string;
  path2: string;
  displayPath?: string;
  headlines: string[];
  descriptions: string[];
  siteLinks?: Array<{title: string, link: string, description?: string}>;
  finalUrl?: string;
  id?: string;
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: "feed" | "story" | "reel";
  hashtags?: string[] | string;
  companyName?: string;
  finalUrl?: string;
}

export interface AdGenerationInput {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone?: string;
  keywords?: string[] | string;
  callToAction?: string[] | string;
  uniqueSellingPoints?: string[] | string;
  websiteUrl?: string;
  [key: string]: any;
}

// MicrosoftAd type definition (extending GoogleAd)
export interface MicrosoftAd extends GoogleAd {}
