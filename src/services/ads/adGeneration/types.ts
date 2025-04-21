
export interface CampaignPromptData {
  companyName: string;
  websiteUrl: string;
  campaignObjective: string;
  targetAudience: string;
  product: string;
  brandTone: string;
  differentials: string[];
  mindTrigger: string;
  language: string;
  platforms: string[];
}

export interface GeneratedAdContent {
  google_ads: GoogleAdContent[];
  instagram_ads: SocialAdContent[];
  linkedin_ads: SocialAdContent[];
  microsoft_ads: MicrosoftAdContent[];
}

interface GoogleAdContent {
  headline_1: string;
  headline_2: string;
  description_1: string;
  description_2: string;
  display_url: string;
}

interface SocialAdContent {
  text: string;
  image_prompt: string;
}

interface MicrosoftAdContent {
  headline_1: string;
  headline_2: string;
  description: string;
}
