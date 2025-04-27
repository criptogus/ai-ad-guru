
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
  companyDescription?: string;
  keywords?: string[] | string;
  callToAction?: string[] | string;
  language?: string;
  platforms?: string[];
  industry?: string;
}

// Re-adding PromptMessages interface
export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}
