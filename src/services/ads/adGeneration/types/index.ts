
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
  callToAction?: string[] | string;
  keywords?: string[] | string;
}

export interface GeneratedAdContent {
  google: GoogleAd[];
  meta: MetaAd[];
  linkedin: LinkedInAd[];
  microsoft: MicrosoftAd[];
  
  // Also include the legacy format for backward compatibility
  google_ads?: GoogleAd[];
  meta_ads?: MetaAd[];
  instagram_ads?: MetaAd[];
  linkedin_ads?: LinkedInAd[];
  microsoft_ads?: MicrosoftAd[];
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

// Re-export types from promptTypes.ts
export * from './promptTypes';
