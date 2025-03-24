
// Google Ad Types
export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
  finalUrl?: string;
  displayPath?: string;
  keywords?: string[];
  negativeKeywords?: string[];
  adGroupId?: string;
  adGroupName?: string;
  adId?: string;
  status?: string;
  callToActionType?: string;
  notes?: string;
}

// Instagram/Meta Ad Types
export interface MetaAd {
  headline?: string;
  primaryText?: string;
  description?: string;
  imageUrl?: string;
  imagePrompt?: string;
  videoUrl?: string;
  callToAction?: string;
  adGroupId?: string;
  adGroupName?: string;
  adId?: string;
  status?: string;
  audienceId?: string;
  placementId?: string;
  notes?: string;
}

// LinkedIn Ad Types
export interface LinkedInAd extends MetaAd {
  // LinkedIn ads use the same structure as Meta ads
  // but may have LinkedIn-specific fields in the future
  companyName?: string;
  industryContext?: string;
  professionalContext?: string;
  linkedInFormat?: 'single-image' | 'carousel' | 'video' | 'text';
}

// Hook Return Type
export interface UseAdGenerationReturn {
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>;
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (campaignData: any) => Promise<MetaAd[] | null>;
  generateMicrosoftAds: (campaignData: any) => Promise<any[] | null>;
  generateAdImage: (prompt: string, additionalInfo?: any) => Promise<string | null>;
  isGenerating: boolean;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  linkedInAds: MetaAd[];
}
