
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  finalUrl?: string;
  path1?: string;
  path2?: string;
  displayPath?: string;
  siteLinks?: Array<{title: string, link: string}>;
  // Add these properties explicitly in the interface
  headlines?: string[];
  descriptions?: string[];
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  // Add these properties explicitly in the interface
  format?: string;
  hashtags?: string[] | string;
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
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  isGenerating: boolean;
}
