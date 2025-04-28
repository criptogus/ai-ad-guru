
export interface CampaignPromptData {
  companyName: string;
  websiteUrl: string;
  objective: string;
  targetAudience: string;
  product?: string;
  brandTone?: string;
  differentials?: string[] | string;
  mindTrigger?: string;
  mindTriggers?: Record<string, string>;
  language?: string;
  platforms?: string[];
  companyDescription?: string;
  industry?: string;
  keywords?: string[] | string;
  callToAction?: string[] | string;
}

export interface GeneratedAdContent {
  google?: Array<GoogleAd>;
  meta?: Array<MetaAd>;
  linkedin?: Array<LinkedInAd>;
  microsoft?: Array<MicrosoftAd>;
  
  // Legacy format properties
  google_ads?: Array<GoogleAd>;
  meta_ads?: Array<MetaAd>;
  instagram_ads?: Array<MetaAd>;
  linkedin_ads?: Array<LinkedInAd>;
  microsoft_ads?: Array<MicrosoftAd>;
}

export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3?: string;
  description1: string;
  description2: string;
  path1?: string;
  path2?: string;
  displayPath?: string;
  finalUrl?: string;
  siteLinks?: Array<{
    title: string;
    description?: string;
    url?: string;
  } | string>;
  headlines?: string[];
  descriptions?: string[];
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  format?: 'feed' | 'story' | 'reel' | 'square';
  hashtags?: string[] | string;
  callToAction?: string;
  isComplete?: boolean;
}

export interface LinkedInAd extends MetaAd {
  // LinkedIn ads use the same structure as Meta Ads
}

export interface MicrosoftAd extends GoogleAd {
  // Microsoft ads use the same structure as Google Ads
}

export interface ImageGenerationParams {
  platform: string;
  format?: string;
  prompt: string;
  companyName: string;
  brandTone?: string;
  industry?: string;
  targetAudience?: string;
  language?: string;
}

export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}
