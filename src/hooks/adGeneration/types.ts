
// Types for Google Ads
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  headlines?: string[];
  descriptions?: string[];
  finalUrl?: string;
  displayPath?: string;
  path1?: string;
  path2?: string;
  siteLinks?: string[];
}

// Types for Meta/Instagram Ads
export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: string;
  hashtags?: string[];
}

// Ad Generation Input
export interface AdGenerationInput {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[] | string;
  callToAction: string[] | string;
  uniqueSellingPoints: string[] | string;
  websiteUrl?: string;
  [key: string]: any;
}

// Return type for useAdGeneration hook
export interface UseAdGenerationReturn {
  generateGoogleAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateMetaAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateMicrosoftAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  isGenerating: boolean;
}
