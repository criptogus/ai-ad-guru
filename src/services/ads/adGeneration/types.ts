
export interface CampaignPromptData {
  companyName: string;
  websiteUrl: string;
  objective: string;
  targetAudience: string;
  product?: string;
  brandTone?: string;
  differentials?: string[];
  mindTrigger?: string;
  language?: string;
  platforms?: string[];
}

export interface GeneratedAdContent {
  google_ads?: Array<{
    headline_1: string;
    headline_2: string;
    description_1: string;
    description_2: string;
    display_url: string;
  }>;
  instagram_ads?: Array<{
    text: string;
    image_prompt: string;
  }>;
  linkedin_ads?: Array<{
    text: string;
    image_prompt: string;
  }>;
  microsoft_ads?: Array<{
    headline_1: string;
    headline_2: string;
    description: string;
  }>;
}
