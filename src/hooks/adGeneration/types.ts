
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  path1: string;
  path2: string;
  displayPath?: string;
  headlines: string[];  // Making headlines required
  descriptions: string[];  // Making descriptions required
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
  format?: "feed" | "story" | "reel";  // Adding format property
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

export interface UseAdGenerationReturn {
  generateGoogleAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateMetaAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateMicrosoftAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateAdImage: (prompt: string, additionalContext?: any) => Promise<string | null>;
  isGenerating: boolean;
}

// MicrosoftAd type definition (extending GoogleAd)
export interface MicrosoftAd extends GoogleAd {}
