
export interface CampaignPromptData {
  companyName: string;
  websiteUrl?: string;
  objective?: string;
  product?: string;
  targetAudience?: string;
  brandTone?: string;
  mindTrigger?: string;
  language?: string;
  industry?: string;
  platforms?: string[];
  companyDescription?: string;
  differentials?: string[];
  callToAction?: string | string[];
  keywords?: string | string[];
  [key: string]: any;
}

export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}
