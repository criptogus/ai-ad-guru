export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  finalUrl?: string;
  path1?: string;
  path2?: string;
  headlines: string[];
  descriptions: string[];
  displayPath?: string;
  siteLinks?: string[];
}

export interface MetaAd {
  primaryText: string;
  headline?: string;
  description?: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: string;
  hashtags?: string[];
}

export interface AdGenerationInput {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
  websiteUrl?: string;
  [key: string]: any; // For additional campaign data
}

export interface UseAdGenerationReturn {
  generateGoogleAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateMetaAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<MetaAd[] | null>;
  generateMicrosoftAds: (input: AdGenerationInput, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  generateAdImage: (prompt: string, options?: any) => Promise<string | null>;
  isGenerating: boolean;
}
