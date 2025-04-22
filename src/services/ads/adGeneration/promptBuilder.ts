
import { CampaignPromptData } from './types/promptTypes';
import { PromptMessages } from './types/promptTypes';

export const buildGoogleAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert Google Ads copywriter. Create 5 high-converting Google text ads.`;
  
  const userMessage = `
Create 5 Google Search Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Objective: ${data.objective || 'awareness'}
Mind Trigger: ${data.mindTrigger || 'none'}
Company Description: ${data.companyDescription || '(not provided)'}
Unique Selling Points: ${(data.differentials && data.differentials.length > 0) ? data.differentials.join(', ') : '(not provided)'}

Each ad should include:
- 3 Headlines (max 30 chars each)
- 2 Descriptions (max 90 chars each)
- A display URL

Format the response as valid JSON array with objects containing:
{
  "headline_1": "...",
  "headline_2": "...",
  "headline_3": "...",
  "description_1": "...",
  "description_2": "...",
  "display_url": "..."
}
`;

  return { systemMessage, userMessage };
};

export const buildMetaAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert Meta Ads copywriter and image prompt engineer. Create 5 high-converting Instagram ads.`;
  
  const userMessage = `
Create 5 Instagram Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Objective: ${data.objective || 'awareness'}
Mind Trigger: ${data.mindTrigger || 'none'}
Company Description: ${data.companyDescription || '(not provided)'}
Unique Selling Points: ${(data.differentials && data.differentials.length > 0) ? data.differentials.join(', ') : '(not provided)'}

Each ad should include:
- Ad text (caption) with compelling hook, clear value proposition, and strong call to action
- Image prompt for DALL-E to generate a high-quality Instagram image

Format the response as valid JSON array with objects containing:
{
  "text": "...",
  "image_prompt": "..."
}
`;

  return { systemMessage, userMessage };
};

export const buildLinkedInAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert LinkedIn Ads copywriter and image prompt engineer. Create 5 high-converting LinkedIn ads.`;
  
  const userMessage = `
Create 5 LinkedIn Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Objective: ${data.objective || 'awareness'}
Mind Trigger: ${data.mindTrigger || 'none'}
Company Description: ${data.companyDescription || '(not provided)'}
Unique Selling Points: ${(data.differentials && data.differentials.length > 0) ? data.differentials.join(', ') : '(not provided)'}

Each ad should include:
- Ad text with professional tone, clear business value, and appropriate call to action for B2B audience
- Image prompt for DALL-E to generate a high-quality professional LinkedIn image

Format the response as valid JSON array with objects containing:
{
  "text": "...",
  "image_prompt": "..."
}
`;

  return { systemMessage, userMessage };
};

export const buildMicrosoftAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert Microsoft Ads copywriter. Create 5 high-converting Microsoft/Bing text ads.`;
  
  const userMessage = `
Create 5 Microsoft/Bing Search Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Objective: ${data.objective || 'awareness'}
Mind Trigger: ${data.mindTrigger || 'none'}
Company Description: ${data.companyDescription || '(not provided)'}
Unique Selling Points: ${(data.differentials && data.differentials.length > 0) ? data.differentials.join(', ') : '(not provided)'}

Each ad should include:
- 3 Headlines (max 30 chars each)
- 2 Descriptions (max 90 chars each)
- A display URL

Format the response as valid JSON array with objects containing:
{
  "headline_1": "...",
  "headline_2": "...",
  "headline_3": "...",
  "description_1": "...",
  "description_2": "...",
  "display_url": "..."
}
`;

  return { systemMessage, userMessage };
};
