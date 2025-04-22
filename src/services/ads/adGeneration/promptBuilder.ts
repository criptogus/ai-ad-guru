
import { CampaignPromptData } from './types/promptTypes';
import { PromptMessages } from './types/promptTypes';

export const buildGoogleAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert Google Ads copywriter. Create 5 high-converting Google text ads for ${data.companyName || 'this company'} in the ${data.industry || 'specified'} industry, targeting ${data.targetAudience || 'their audience'}. The ads should focus on ${data.objective || 'awareness'} with a ${data.brandTone || 'professional'} tone. Include ${data.mindTrigger ? 'the psychological trigger: ' + data.mindTrigger : 'appropriate psychological triggers'}.`;
  
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
Keywords: ${(data.keywords && data.keywords.length > 0) ? (Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords) : '(not provided)'}
Call to Action: ${(data.callToAction && data.callToAction.length > 0) ? (Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction) : 'Learn More'}

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
  const systemMessage = `You are an expert Meta Ads copywriter and image prompt engineer. Create 5 high-converting Instagram ads for ${data.companyName || 'this company'} in the ${data.industry || 'specified'} industry, targeting ${data.targetAudience || 'their audience'}. The ads should focus on ${data.objective || 'awareness'} with a ${data.brandTone || 'professional'} tone. Include ${data.mindTrigger ? 'the psychological trigger: ' + data.mindTrigger : 'appropriate psychological triggers'}.`;
  
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
Keywords: ${(data.keywords && data.keywords.length > 0) ? (Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords) : '(not provided)'}
Call to Action: ${(data.callToAction && data.callToAction.length > 0) ? (Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction) : 'Learn More'}

Each ad should include:
- Ad text (caption) with compelling hook, clear value proposition, and strong call to action
- Image prompt for DALL-E to generate a high-quality Instagram image

Format the response as valid JSON array with objects containing:
{
  "headline": "...",
  "primaryText": "...",
  "description": "...",
  "image_prompt": "..."
}
`;

  return { systemMessage, userMessage };
};

export const buildLinkedInAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert LinkedIn Ads copywriter and image prompt engineer. Create 5 high-converting LinkedIn ads for ${data.companyName || 'this company'} in the ${data.industry || 'specified'} industry, targeting ${data.targetAudience || 'their audience'}. The ads should focus on ${data.objective || 'awareness'} with a ${data.brandTone || 'professional'} tone. Include ${data.mindTrigger ? 'the psychological trigger: ' + data.mindTrigger : 'appropriate psychological triggers'}.`;
  
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
Keywords: ${(data.keywords && data.keywords.length > 0) ? (Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords) : '(not provided)'}
Call to Action: ${(data.callToAction && data.callToAction.length > 0) ? (Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction) : 'Learn More'}

Each ad should include:
- Headline that captures attention and highlights value proposition
- Primary text with professional tone, clear business value proposition
- Description that expands on benefits and includes appropriate call to action for B2B audience
- Image prompt for DALL-E to generate a high-quality professional LinkedIn image

Format the response as valid JSON array with objects containing:
{
  "headline": "...",
  "primaryText": "...",
  "description": "...",
  "image_prompt": "..."
}
`;

  return { systemMessage, userMessage };
};

export const buildMicrosoftAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are an expert Microsoft Ads copywriter. Create 5 high-converting Microsoft/Bing text ads for ${data.companyName || 'this company'} in the ${data.industry || 'specified'} industry, targeting ${data.targetAudience || 'their audience'}. The ads should focus on ${data.objective || 'awareness'} with a ${data.brandTone || 'professional'} tone. Include ${data.mindTrigger ? 'the psychological trigger: ' + data.mindTrigger : 'appropriate psychological triggers'}.`;
  
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
Keywords: ${(data.keywords && data.keywords.length > 0) ? (Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords) : '(not provided)'}
Call to Action: ${(data.callToAction && data.callToAction.length > 0) ? (Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction) : 'Learn More'}

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
