
export interface WebsiteAnalysisResult {
  companyName: string;
  websiteUrl: string;
  industry?: string;
  product?: string;
  businessDescription?: string;
  companyDescription?: string;
  targetAudience?: string;
  uniqueSellingPoints?: string[] | string;
  callToAction?: string[] | string;
  keywords?: string[] | string;
  brandTone?: string;
  mindTrigger?: string;
  objective?: string;
}

export interface PromptMessages {
  systemMessage?: string;
  userMessage: string;
}
