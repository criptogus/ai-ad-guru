
import { WebsiteAnalysisResult } from "./types.ts";

// Helper to handle not provided values
function notProvided(fieldName: string): string {
  return `Not provided — do not invent`;
}

// Robust helper to format any array-like or other messy input
function formatArray(input: any): string {
  if (!Array.isArray(input) || input.length === 0) return "Not provided — do not invent";
  return input.map(String).join(", ");
}

// Helper to escape quotes & basic sanitize
function escapeQuotes(text: string | undefined): string {
  if (!text) return "";
  return String(text).replace(/"/g, '\\"');
}

// NEW: Dynamically get display URL from target website
function getDisplayUrl(websiteUrl: string | undefined): string {
  if (!websiteUrl) return "example.com";
  try {
    return new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`).hostname.replace("www.", "") || "example.com";
  } catch {
    return "example.com";
  }
}

// Common system message for all prompt creators
const systemMessage = `You are a senior copywriter and creative director in a world-class advertising agency. You write high-performing ads that strictly follow client briefings. NEVER invent company context or features. Do NOT mention things not included in the data.`;

// ALL PROMPTS NOW INCLUDE campaignName, robust field access, escaping, and display_url

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = escapeQuotes(campaignData.companyName) || notProvided("company name");
  const campaignName = escapeQuotes(campaignData.campaignName) || "Unnamed Campaign";
  const websiteUrl = escapeQuotes(campaignData.websiteUrl) || notProvided("website");
  const displayUrl = getDisplayUrl(campaignData.websiteUrl);
  const industry = escapeQuotes(campaignData.industry) || notProvided("industry");
  const product = escapeQuotes(campaignData.product) || notProvided("product/service");
  const objective = escapeQuotes(campaignData.objective) || notProvided("objective");
  const targetAudience = escapeQuotes(campaignData.targetAudience) || notProvided("target audience");
  const brandTone = escapeQuotes(campaignData.brandTone) || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = escapeQuotes(campaignData.companyDescription || campaignData.businessDescription) || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = escapeQuotes(campaignData.callToAction) || "Learn More";
  const language = escapeQuotes(campaignData.language) || "English";

  return `
${systemMessage}

Create 5 different ad variations for Google Ads.
Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Campaign: ${campaignName}
Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${escapeQuotes(mindTrigger) || "Not provided — do not invent"}
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
  "display_url": "${displayUrl}"
}

NO placeholders, NO hallucinated facts, and do NOT exceed character limits. Only use data above.
`;
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = escapeQuotes(campaignData.companyName) || notProvided("company name");
  const campaignName = escapeQuotes(campaignData.campaignName) || "Unnamed Campaign";
  const websiteUrl = escapeQuotes(campaignData.websiteUrl) || notProvided("website");
  const industry = escapeQuotes(campaignData.industry) || notProvided("industry");
  const product = escapeQuotes(campaignData.product) || notProvided("product/service");
  const objective = escapeQuotes(campaignData.objective) || notProvided("objective");
  const targetAudience = escapeQuotes(campaignData.targetAudience) || notProvided("target audience");
  const brandTone = escapeQuotes(campaignData.brandTone) || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = escapeQuotes(campaignData.companyDescription || campaignData.businessDescription) || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = escapeQuotes(campaignData.callToAction) || "Learn More";
  const language = escapeQuotes(campaignData.language) || "English";

  return `
${systemMessage}

Create 5 different ad variations for Instagram/Meta Ads.
Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Campaign: ${campaignName}
Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${escapeQuotes(mindTrigger) || "Not provided — do not invent"}
Unique Selling Points: ${differentials}
Company Description: ${description}
Keywords: ${keywords}
Call to Action: ${callToAction}

LANGUAGE: ${language}
Respond using this language: ${language}

Create 5 engaging Instagram/Meta ads. Each ad should have a compelling primary text (caption) and an image prompt that describes a photorealistic ad image WITHOUT text overlay, suitable for DALL·E generation.

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "primaryText": "...",    // main caption (emotional/engaging)
  "image_prompt": "photorealistic Instagram ad for ${companyName}, product: ${product}, glowing dark background, cinematic, no text"
}

NO placeholders, NO hallucinated facts. Only use data above.
`;
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = escapeQuotes(campaignData.companyName) || notProvided("company name");
  const campaignName = escapeQuotes(campaignData.campaignName) || "Unnamed Campaign";
  const websiteUrl = escapeQuotes(campaignData.websiteUrl) || notProvided("website");
  const industry = escapeQuotes(campaignData.industry) || notProvided("industry");
  const product = escapeQuotes(campaignData.product) || notProvided("product/service");
  const objective = escapeQuotes(campaignData.objective) || notProvided("objective");
  const targetAudience = escapeQuotes(campaignData.targetAudience) || notProvided("target audience");
  const brandTone = escapeQuotes(campaignData.brandTone) || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = escapeQuotes(campaignData.companyDescription || campaignData.businessDescription) || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = escapeQuotes(campaignData.callToAction) || "Learn More";
  const language = escapeQuotes(campaignData.language) || "English";

  return `
${systemMessage}

Create 5 different ad variations for LinkedIn Ads.
Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Campaign: ${campaignName}
Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${escapeQuotes(mindTrigger) || "Not provided — do not invent"}
Unique Selling Points: ${differentials}
Company Description: ${description}
Keywords: ${keywords}
Call to Action: ${callToAction}

LANGUAGE: ${language}
Respond using this language: ${language}

Create 5 professional LinkedIn ads. Each ad should have a business-oriented headline, primary text that establishes authority, a description, and an image prompt for a professional context.

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "headline": "...",        // professional headline for B2B audience
  "primaryText": "...",     // business-focused main content
  "description": "...",     // supporting business context
  "image_prompt": "clean professional photo for LinkedIn, high-end, no text, business owner interacting with dashboard"
}

NO placeholders, NO hallucinated facts. Only use data above.
`;
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = escapeQuotes(campaignData.companyName) || notProvided("company name");
  const campaignName = escapeQuotes(campaignData.campaignName) || "Unnamed Campaign";
  const websiteUrl = escapeQuotes(campaignData.websiteUrl) || notProvided("website");
  const displayUrl = getDisplayUrl(campaignData.websiteUrl);
  const industry = escapeQuotes(campaignData.industry) || notProvided("industry");
  const product = escapeQuotes(campaignData.product) || notProvided("product/service");
  const objective = escapeQuotes(campaignData.objective) || notProvided("objective");
  const targetAudience = escapeQuotes(campaignData.targetAudience) || notProvided("target audience");
  const brandTone = escapeQuotes(campaignData.brandTone) || notProvided("brand tone");
  const differentials = formatArray(campaignData.uniqueSellingPoints);
  const description = escapeQuotes(campaignData.companyDescription || campaignData.businessDescription) || notProvided("company description");
  const keywords = formatArray(campaignData.keywords);
  const callToAction = escapeQuotes(campaignData.callToAction) || "Learn More";
  const language = escapeQuotes(campaignData.language) || "English";

  return `
${systemMessage}

Create 5 different ad variations for Microsoft/Bing Ads.
Use ONLY the data below. Do not invent features or business context. Omit any section where data is missing—do NOT invent or use generic fill-ins.

Campaign: ${campaignName}
Company: ${companyName}
Website: ${websiteUrl}
Product/Service: ${product}
Industry: ${industry}
Target Audience: ${targetAudience}
Campaign Objective: ${objective}
Tone of Voice: ${brandTone}
Psychological Trigger: ${escapeQuotes(mindTrigger) || "Not provided — do not invent"}
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
  "display_url": "${displayUrl}"
}

NO placeholders, NO hallucinated facts, and do NOT exceed character limits. Only use data above.
`;
}
