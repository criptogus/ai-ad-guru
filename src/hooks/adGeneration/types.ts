
export interface GoogleAd {
  headline1?: string;
  headline2?: string;
  headline3?: string;
  description1?: string;
  description2?: string;
  path1?: string;
  path2?: string;
  finalUrl?: string;
  headlines?: string[];
  descriptions?: string[];
}

export interface MetaAd {
  headline?: string;
  primaryText?: string;
  description?: string;
  imageUrl?: string;
  imagePrompt?: string;
  callToAction?: string;
  format?: "feed" | "story" | "reel";
  hashtags?: string[];
}
