
export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export interface CampaignPromptData {
  companyName?: string;
  websiteUrl?: string;
  product?: string;
  industry?: string;
  targetAudience?: string;
  objective?: string;
  brandTone?: string;
  mindTrigger?: string;
  mindTriggers?: Record<string, string>;
  differentials?: string[] | string;
  companyDescription?: string;
  keywords?: string[] | string;
  callToAction?: string[] | string;
  language?: string;
}
