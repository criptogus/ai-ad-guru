
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
  headlines?: string[];
  descriptions?: string[];
}

export interface MetaAd {
  headline: string;
  primaryText: string;
  description: string;
  imagePrompt?: string;
  imageUrl?: string;
  format?: string;
  hashtags?: string[];
}
