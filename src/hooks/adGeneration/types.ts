
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  finalUrl: string;
  path1?: string;
  path2?: string;
}

export interface MetaAd {
  primaryText: string;
  headline: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface UseAdGenerationReturn {
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>;
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (campaignData: any) => Promise<any[] | null>; 
  generateMicrosoftAds: (campaignData: any) => Promise<any[] | null>; 
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  isGenerating: boolean;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
}
