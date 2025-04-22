
export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export interface CampaignPromptData {
  companyName?: string;
  websiteUrl?: string;
  industry?: string;
  product?: string;
  objective?: string;
  brandTone?: string;
  language?: string;
  targetAudience?: string;
  companyDescription?: string;
  keywords?: string[] | string;
  differentials?: string[] | string;
  callToAction?: string[] | string;
  mindTrigger?: string;
  mindTriggers?: Record<string, string>;
  platforms?: string[];
}
