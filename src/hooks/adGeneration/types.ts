// Define interfaces for ad types
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3?: string;
  description1: string;
  description2: string;
  path1?: string;
  path2?: string;
  siteLinks?: string[];
  headlines?: string[];
  descriptions?: string[];
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  format?: 'feed' | 'story' | 'reel';
  hashtags?: string[];
  callToAction?: string;
}

export interface MicrosoftAd extends GoogleAd {
  // Microsoft ads use the same structure as Google Ads
}

export interface LinkedInAd extends MetaAd {
  // LinkedIn ads use the same structure as Meta Ads
}
