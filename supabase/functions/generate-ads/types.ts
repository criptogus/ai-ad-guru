
export interface WebsiteAnalysisResult {
  companyName?: string;
  businessDescription?: string;
  industry?: string;
  targetAudience?: string;
  brandTone?: string;
  keywords?: string[];
  callToAction?: string[] | string;
  uniqueSellingPoints?: string[];
  websiteUrl?: string;
  [key: string]: any;
}
