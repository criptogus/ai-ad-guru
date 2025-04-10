
export interface GoogleAd {
  id?: string;
  headline1: string;
  headline2: string;
  headline3: string;
  description1: string;
  description2: string;
  path1: string;
  path2: string;
  displayPath?: string;
  headlines: string[];
  descriptions: string[];
  finalUrl?: string; // Added finalUrl property
  siteLinks?: {
    title: string;
    link: string;
    description?: string;
  }[];
}

export interface MetaAd {
  id?: string;
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: 'feed' | 'story' | 'reel';  // Define as opções de formato permitidas
  hashtags?: string[] | string;
  companyName?: string;
}

export interface LinkedInAd extends MetaAd {}
export interface MicrosoftAd extends GoogleAd {}
