
import { WebsiteAnalysisResult } from '../useWebsiteAnalysis';

export interface GoogleAd {
  headlines: string[];
  descriptions: string[];
}

export interface MetaAd {
  primaryText: string;
  headline: string;
  description: string;
  imagePrompt: string; // This is required in MetaAd
  imageUrl?: string; // Added after image generation
}

export interface UseAdGenerationReturn {
  generateGoogleAds: (campaignData: WebsiteAnalysisResult) => Promise<GoogleAd[] | null>;
  generateMetaAds: (campaignData: WebsiteAnalysisResult) => Promise<MetaAd[] | null>;
  generateAdImage: (prompt: string) => Promise<string | null>;
  isGenerating: boolean;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
}
