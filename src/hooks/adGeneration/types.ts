
// Google Ad type definitions
export interface GoogleAd {
  headline1: string;
  headline2: string;
  headline3?: string;
  description1: string;
  description2?: string;
  path1?: string;
  path2?: string;
  finalUrl?: string;
  headlines?: string[];
  descriptions?: string[];
  siteLinks?: { title: string; description?: string; url: string }[];
  displayPath?: string;
}

// Meta Ad type definitions
export interface MetaAd {
  headline: string;
  primaryText: string;
  description?: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: "square" | "portrait" | "landscape" | "feed" | "story" | "reel";
  hashtags?: string[] | string;
  callToAction?: string;
}

// Microsoft Ad type definitions
export interface MicrosoftAd extends GoogleAd {
  // Microsoft Ads use the same format as Google Ads
  // but might have additional properties in the future
}

// LinkedIn Ad type definitions
export interface LinkedInAd extends MetaAd {
  // LinkedIn Ads use the same format as Meta Ads
  // but might have additional properties in the future
}
