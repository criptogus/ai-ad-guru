
import { WebsiteAnalysisResult } from "./types.ts";

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const systemMessage = `You are a senior copywriter and creative director in a world-class advertising agency. You write high-performing ads that strictly follow client briefings. NEVER invent company context or features. Do NOT mention things not included in the data.`;

  const companyName = campaignData.companyName || notProvided("company name");
  const websiteUrl = campaignData.websiteUrl || notProvided("website");
  const industry = campaignData.industry || notProvided("industry");
  const product = campaignData.product || notProvided("product/service");
  const objective = campaignData.objective || notProvided("objective");
  const targetAudience = campaignData.targetAudience || notProvided("target audience");
  const brandTone = campaignData.brandTone || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = campaignData.companyDescription || campaignData.businessDescription || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = campaignData.callToAction || "Learn More";
  const language = campaignData.language || "English";

  return `
${systemMessage}

Create 5 different ad variations for Google Ads.

Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${mindTrigger || "Not provided — do not invent"}
Unique Selling Points: ${differentials}
Company Description: ${description}
Keywords: ${keywords}
Call to Action: ${callToAction}

LANGUAGE: ${language}
Respond using this language: ${language}

Create 5 high-converting Google Search ads. Each ad must have 3 headlines (max 30 chars each) and 2 descriptions (max 90 chars each).

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "headline_1": "...",    // max 30 chars
  "headline_2": "...",    // max 30 chars
  "headline_3": "...",    // max 30 chars
  "description_1": "...", // max 90 chars
  "description_2": "...", // max 90 chars
  "display_url": "www.example.com/path"   // display URL
}

NO placeholders, NO hallucinated facts, and do NOT exceed character limits. Only use data above.
`;
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const systemMessage = `You are a senior copywriter and creative director in a world-class advertising agency. You write high-performing ads that strictly follow client briefings. NEVER invent company context or features. Do NOT mention things not included in the data.`;

  const companyName = campaignData.companyName || notProvided("company name");
  const websiteUrl = campaignData.websiteUrl || notProvided("website");
  const industry = campaignData.industry || notProvided("industry");
  const product = campaignData.product || notProvided("product/service");
  const objective = campaignData.objective || notProvided("objective");
  const targetAudience = campaignData.targetAudience || notProvided("target audience");
  const brandTone = campaignData.brandTone || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = campaignData.companyDescription || campaignData.businessDescription || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = campaignData.callToAction || "Learn More";
  const language = campaignData.language || "English";

  return `
${systemMessage}

Create 5 different ad variations for Instagram/Meta Ads.

Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${mindTrigger || "Not provided — do not invent"}
Unique Selling Points: ${differentials}
Company Description: ${description}
Keywords: ${keywords}
Call to Action: ${callToAction}

LANGUAGE: ${language}
Respond using this language: ${language}

Create 5 engaging Instagram/Meta ads. Each ad should have a compelling headline, primary text (caption), and an image prompt that describes a photo WITHOUT text overlay.

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "headline": "...",       // concise attention grabber
  "primaryText": "...",    // main caption (emotional/engaging)
  "description": "...",    // supporting context (optional)
  "image_prompt": "photorealistic Instagram ad for ${companyName}, product: ${product}, professional lighting, no text"
}

NO placeholders, NO hallucinated facts. Only use data above.
`;
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const systemMessage = `You are a senior copywriter and creative director in a world-class advertising agency. You write high-performing ads that strictly follow client briefings. NEVER invent company context or features. Do NOT mention things not included in the data.`;

  const companyName = campaignData.companyName || notProvided("company name");
  const websiteUrl = campaignData.websiteUrl || notProvided("website");
  const industry = campaignData.industry || notProvided("industry");
  const product = campaignData.product || notProvided("product/service");
  const objective = campaignData.objective || notProvided("objective");
  const targetAudience = campaignData.targetAudience || notProvided("target audience");
  const brandTone = campaignData.brandTone || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = campaignData.companyDescription || campaignData.businessDescription || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = campaignData.callToAction || "Learn More";
  const language = campaignData.language || "English";

  return `
${systemMessage}

Create 5 different ad variations for LinkedIn Ads.

Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${mindTrigger || "Not provided — do not invent"}
Unique Selling Points: ${differentials}
Company Description: ${description}
Keywords: ${keywords}
Call to Action: ${callToAction}

LANGUAGE: ${language}
Respond using this language: ${language}

Create 5 professional LinkedIn ads. Each ad should have a business-oriented headline, primary text that establishes authority, and an image prompt for a professional context.

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "headline": "...",        // professional headline for B2B audience
  "primaryText": "...",     // business-focused main content
  "description": "...",     // supporting business context
  "image_prompt": "clean professional photo for LinkedIn, high-end, no text, business context"
}

NO placeholders, NO hallucinated facts. Only use data above.
`;
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const systemMessage = `You are a senior copywriter and creative director in a world-class advertising agency. You write high-performing ads that strictly follow client briefings. NEVER invent company context or features. Do NOT mention things not included in the data.`;

  const companyName = campaignData.companyName || notProvided("company name");
  const websiteUrl = campaignData.websiteUrl || notProvided("website");
  const industry = campaignData.industry || notProvided("industry");
  const product = campaignData.product || notProvided("product/service");
  const objective = campaignData.objective || notProvided("objective");
  const targetAudience = campaignData.targetAudience || notProvided("target audience");
  const brandTone = campaignData.brandTone || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = campaignData.companyDescription || campaignData.businessDescription || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = campaignData.callToAction || "Learn More";
  const language = campaignData.language || "English";

  return `
${systemMessage}

Create 5 different ad variations for Microsoft/Bing Ads.

Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${mindTrigger || "Not provided — do not invent"}
Unique Selling Points: ${differentials}
Company Description: ${description}
Keywords: ${keywords}
Call to Action: ${callToAction}

LANGUAGE: ${language}
Respond using this language: ${language}

Create 5 high-converting Microsoft/Bing Search ads. Each ad must have 3 headlines (max 30 chars each) and 2 descriptions (max 90 chars each).

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "headline_1": "...",    // max 30 chars
  "headline_2": "...",    // max 30 chars
  "headline_3": "...",    // max 30 chars
  "description_1": "...", // max 90 chars
  "description_2": "...", // max 90 chars
  "display_url": "www.example.com/path"   // display URL
}

NO placeholders, NO hallucinated facts, and do NOT exceed character limits. Only use data above.
`;
}

// Helper function to handle not provided values
function notProvided(fieldName: string): string {
  return `Not provided — do not invent`;
}

// Helper function to format arrays
function formatArray(arr: any[] | undefined): string {
  if (!arr || arr.length === 0) {
    return "Not provided — do not invent";
  }
  return arr.join(", ");
}
