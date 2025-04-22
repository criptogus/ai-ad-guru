
export interface WebsiteAnalysisResult {
  companyName?: string;
  businessDescription?: string;
  targetAudience?: string;
  keywords?: string[] | string;
  uniqueSellingPoints?: string[] | string;
  callToAction?: string[] | string;
  industry?: string;
  brandTone?: string;
  websiteUrl?: string;
}

export interface GoogleAd {
  headlines?: string[];
  descriptions?: string[];
  path1?: string;
  path2?: string;
  finalUrl?: string;
  displayPath?: string;
  siteLinks?: (string | {
    title: string;
    description?: string;
    url?: string;
  })[];
  headline1?: string;
  headline2?: string;
  headline3?: string;
  description1?: string;
  description2?: string;
}

export interface MetaAd {
  headline?: string;
  primaryText?: string;
  description?: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: 'feed' | 'story' | 'reel' | 'square' | 'portrait' | 'landscape';
  hashtags?: string[] | string;
  callToAction?: string;
}
