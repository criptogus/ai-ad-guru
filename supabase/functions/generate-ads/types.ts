
export interface WebsiteAnalysisResult {
  companyName: string;
  websiteUrl?: string;
  industry?: string;
  product?: string;
  targetAudience?: string;
  brandTone?: string;
  companyDescription?: string;
  uniqueSellingPoints?: string[];
  mindTrigger?: string;
  [key: string]: any;
}

export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}
