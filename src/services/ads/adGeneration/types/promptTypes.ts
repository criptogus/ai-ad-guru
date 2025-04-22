
export interface CampaignPromptData {
  companyName: string;
  websiteUrl: string;
  objective: string;
  product?: string;
  targetAudience: string;
  brandTone?: string;
  mindTrigger?: string;
  language?: string;
  industry?: string;
  differentials?: string[];
  platforms?: string[];
}

export interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export interface GeneratedAdContent {
  google_ads?: Array<{
    headline_1: string;
    headline_2: string;
    headline_3: string;
    description_1: string;
    description_2: string;
    display_url: string;
  }>;
  instagram_ads?: Array<{
    text: string;
    image_prompt: string;
  }>;
  meta_ads?: Array<{
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
    display_url: string;
  }>;
}
