
import { WebsiteAnalysisResult } from "./types.ts";
import { PromptMessages } from "./types.ts";

export function createGoogleAdsPrompt(data: WebsiteAnalysisResult, mindTrigger?: string): string {
  const userMessage = `
Create 5 Google Search Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || data.businessDescription || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Mind Trigger: ${mindTrigger || 'none'}
Objective: ${data.objective || 'awareness'}
Company Description: ${data.companyDescription || data.businessDescription || '(not provided)'}
Unique Selling Points: ${(data.uniqueSellingPoints && data.uniqueSellingPoints.length > 0) ? data.uniqueSellingPoints.join(', ') : '(not provided)'}
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

  return userMessage;
}

export function createMetaAdsPrompt(data: WebsiteAnalysisResult, mindTrigger?: string): string {
  const userMessage = `
Create 5 Instagram Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || data.businessDescription || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Mind Trigger: ${mindTrigger || 'none'}
Objective: ${data.objective || 'awareness'}
Company Description: ${data.companyDescription || data.businessDescription || '(not provided)'}
Unique Selling Points: ${(data.uniqueSellingPoints && data.uniqueSellingPoints.length > 0) ? data.uniqueSellingPoints.join(', ') : '(not provided)'}
Keywords: ${(data.keywords && data.keywords.length > 0) ? (Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords) : '(not provided)'}
Call to Action: ${(data.callToAction && data.callToAction.length > 0) ? (Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction) : 'Learn More'}

Each ad should include:
- Ad text (caption) with compelling hook, clear value proposition, and strong call to action
- Image prompt for DALL-E to generate a high-quality Instagram image

Format the response as valid JSON array with objects containing:
{
  "text": "...",
  "image_prompt": "..."
}
`;

  return userMessage;
}

export function createLinkedInAdsPrompt(data: WebsiteAnalysisResult, mindTrigger?: string): string {
  const userMessage = `
Create 5 LinkedIn Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || data.businessDescription || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Mind Trigger: ${mindTrigger || 'none'}
Objective: ${data.objective || 'awareness'}
Company Description: ${data.companyDescription || data.businessDescription || '(not provided)'}
Unique Selling Points: ${(data.uniqueSellingPoints && data.uniqueSellingPoints.length > 0) ? data.uniqueSellingPoints.join(', ') : '(not provided)'}
Keywords: ${(data.keywords && data.keywords.length > 0) ? (Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords) : '(not provided)'}
Call to Action: ${(data.callToAction && data.callToAction.length > 0) ? (Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction) : 'Learn More'}

Each ad should include:
- Ad text with professional tone, clear business value, and appropriate call to action for B2B audience
- Image prompt for DALL-E to generate a high-quality professional LinkedIn image

Format the response as valid JSON array with objects containing:
{
  "text": "...",
  "image_prompt": "..."
}
`;

  return userMessage;
}

export function createMicrosoftAdsPrompt(data: WebsiteAnalysisResult, mindTrigger?: string): string {
  const userMessage = `
Create 5 Microsoft/Bing Search Ads for ${data.companyName}.
Website: ${data.websiteUrl || '(not provided)'}
Industry: ${data.industry || '(not specified)'}
Product/Service: ${data.product || data.businessDescription || 'main product/service'}
Target Audience: ${data.targetAudience || 'general audience'}
Brand Tone: ${data.brandTone || 'professional'}
Mind Trigger: ${mindTrigger || 'none'}
Objective: ${data.objective || 'awareness'}
Company Description: ${data.companyDescription || data.businessDescription || '(not provided)'}
Unique Selling Points: ${(data.uniqueSellingPoints && data.uniqueSellingPoints.length > 0) ? data.uniqueSellingPoints.join(', ') : '(not provided)'}
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

  return userMessage;
}
