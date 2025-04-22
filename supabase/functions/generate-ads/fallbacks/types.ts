
export interface WebsiteAnalysisResult {
  companyName: string;
  websiteUrl: string;
  objective?: string;
  product?: string;
  industry?: string;
  targetAudience?: string;
  brandTone?: string;
  language?: string;
  companyDescription?: string;
  businessDescription?: string;
  uniqueSellingPoints?: string[];
  callToAction?: string | string[];
  keywords?: string[];
}

export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  displayPath?: string;
  path1?: string;
  path2?: string;
  headlines?: string[];
  descriptions?: string[];
  siteLinks?: string[] | { title: string; description?: string }[];
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt: string;
  format?: string;
}

export interface LinkedInAd extends MetaAd {}

export interface MicrosoftAd extends GoogleAd {}
