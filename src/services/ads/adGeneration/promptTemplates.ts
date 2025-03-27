
/**
 * Ad Prompt Templates
 * Templates for generating ad content
 */

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  template: string;
}

export const GOOGLE_AD_TEMPLATES: PromptTemplate[] = [
  {
    id: 'google-features-benefits',
    name: 'Features & Benefits',
    description: 'Highlight product features and their benefits',
    platform: 'google',
    template: 'Create Google Search Ads that highlight the key features and benefits of {companyName} in the {industry} industry. Focus on how these features solve problems for {targetAudience}.'
  },
  {
    id: 'google-social-proof',
    name: 'Social Proof',
    description: 'Leverage testimonials and social proof',
    platform: 'google',
    template: 'Create Google Search Ads that leverage social proof and testimonials for {companyName}. Emphasize how many customers trust the company and the results they\'ve achieved.'
  }
];

export const META_AD_TEMPLATES: PromptTemplate[] = [
  {
    id: 'meta-lifestyle',
    name: 'Lifestyle',
    description: 'Show the lifestyle benefits of your product',
    platform: 'meta',
    template: 'Create Instagram Ads that showcase the lifestyle benefits of using {companyName} products/services. Show how {targetAudience} can improve their lives.'
  },
  {
    id: 'meta-problem-solution',
    name: 'Problem-Solution',
    description: 'Present a problem and your solution',
    platform: 'meta',
    template: 'Create Instagram Ads that present a common problem faced by {targetAudience} and how {companyName} provides the perfect solution.'
  }
];

export const LINKEDIN_AD_TEMPLATES: PromptTemplate[] = [
  {
    id: 'linkedin-professional',
    name: 'Professional Growth',
    description: 'Focus on professional development',
    platform: 'linkedin',
    template: 'Create LinkedIn Ads that focus on professional growth and development opportunities provided by {companyName} for professionals in the {industry} industry.'
  },
  {
    id: 'linkedin-authority',
    name: 'Industry Authority',
    description: 'Position as an industry authority',
    platform: 'linkedin',
    template: 'Create LinkedIn Ads that position {companyName} as an authority in the {industry} industry, highlighting expertise, awards, and recognition.'
  }
];

export const MICROSOFT_AD_TEMPLATES: PromptTemplate[] = [
  {
    id: 'microsoft-b2b',
    name: 'B2B Focus',
    description: 'Target business decision-makers',
    platform: 'microsoft',
    template: 'Create Microsoft Ads targeting business decision-makers in the {industry} industry, highlighting how {companyName} can improve business operations.'
  },
  {
    id: 'microsoft-roi',
    name: 'ROI Focus',
    description: 'Emphasize return on investment',
    platform: 'microsoft',
    template: 'Create Microsoft Ads that emphasize the ROI and cost savings that {companyName} provides to businesses in the {industry} industry.'
  }
];

/**
 * Get prompt templates for a specific platform
 */
export const getPromptTemplates = (platform: string): PromptTemplate[] => {
  switch (platform) {
    case 'google':
      return GOOGLE_AD_TEMPLATES;
    case 'meta':
      return META_AD_TEMPLATES;
    case 'linkedin':
      return LINKEDIN_AD_TEMPLATES;
    case 'microsoft':
      return MICROSOFT_AD_TEMPLATES;
    default:
      return [];
  }
};
