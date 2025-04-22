
import { CampaignPromptData } from './types/promptTypes';
import { PromptMessages } from './types/promptTypes';

// ------ Helper to handle proper field collapse ------
function fieldOrDoNotInvent(val: any, notProvidedMsg = "Not provided — do not invent"): string {
  if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) return notProvidedMsg;
  if (Array.isArray(val) && val.length === 0) return notProvidedMsg;
  if (Array.isArray(val)) return val.join(', ');
  return val;
}

// ------ Unified Prompt Builder ------
export const buildUnifiedPrompt = (data: CampaignPromptData, platform: string): PromptMessages => {
  // Get platform-specific mind trigger from the mindTriggers object or fallback
  const mindTrigger = data.mindTriggers?.[platform] || 
    data.mindTrigger || 
    "Not provided — do not invent";
  
  // Build unified system message
  const systemMessage = `You are a senior copywriter and creative director in a world-class advertising agency. You write high-performing ads that strictly follow client briefings. NEVER invent company context or features. Do NOT mention things not included in the data.`;

  // Build platform-specific instructions
  let platformInstructions = '';
  let jsonSchema = '';
  
  if (platform === 'google' || platform === 'microsoft') {
    platformInstructions = `Create 5 high-converting ${platform === 'google' ? 'Google' : 'Microsoft/Bing'} Search ads. Each ad must have 3 headlines (max 30 chars each) and 2 descriptions (max 90 chars each).`;
    jsonSchema = `
{
  "headline_1": "...",    // max 30 chars
  "headline_2": "...",    // max 30 chars
  "headline_3": "...",    // max 30 chars
  "description_1": "...", // max 90 chars
  "description_2": "...", // max 90 chars
  "display_url": "www.example.com/path"   // display URL
}`;
  } else if (platform === 'meta' || platform === 'instagram') {
    platformInstructions = `Create 5 engaging Instagram/Meta ads. Each ad should have a compelling headline, primary text (caption), and an image prompt that describes a photo WITHOUT text overlay.`;
    jsonSchema = `
{
  "headline": "...",       // concise attention grabber
  "primaryText": "...",    // main caption (emotional/engaging)
  "description": "...",    // supporting context (optional)
  "image_prompt": "photorealistic Instagram ad for ${data.companyName || 'company'}, product: ${data.product || 'product'}, professional lighting, no text"
}`;
  } else if (platform === 'linkedin') {
    platformInstructions = `Create 5 professional LinkedIn ads. Each ad should have a business-oriented headline, primary text that establishes authority, and an image prompt for a professional context.`;
    jsonSchema = `
{
  "headline": "...",        // professional headline for B2B audience
  "primaryText": "...",     // business-focused main content
  "description": "...",     // supporting business context
  "image_prompt": "clean professional photo for LinkedIn, high-end, no text, business context"
}`;
  }

  // Build unified user message with proper handling of missing fields
  const userMessage = `
Create 5 different ad variations for ${platform === 'google' ? 'Google Ads' : platform === 'microsoft' ? 'Microsoft/Bing Ads' : platform === 'meta' ? 'Instagram/Meta Ads' : 'LinkedIn Ads'}.

Use ONLY the data below. Do not invent features, services, or business context. Omit any section completely where data is missing—do NOT use generic fillers or invented information.

Company: ${fieldOrDoNotInvent(data.companyName)}
Website: ${fieldOrDoNotInvent(data.websiteUrl)}
Product/Service: ${fieldOrDoNotInvent(data.product)}
Industry: ${fieldOrDoNotInvent(data.industry)}
Target Audience: ${fieldOrDoNotInvent(data.targetAudience)}
Campaign Objective: ${fieldOrDoNotInvent(data.objective)}
Tone of Voice: ${fieldOrDoNotInvent(data.brandTone)}
Psychological Trigger: ${fieldOrDoNotInvent(mindTrigger, "None")}
Unique Selling Points: ${fieldOrDoNotInvent(data.differentials)}
Company Description: ${fieldOrDoNotInvent(data.companyDescription)}
Keywords: ${fieldOrDoNotInvent(data.keywords)}
Call to Action: ${fieldOrDoNotInvent(
    Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction
)}

LANGUAGE: ${data.language || 'English'}
Respond using this language: ${data.language || 'English'}

${platformInstructions}

Format the output as a JSON array with 5 objects, strictly following this format:
${jsonSchema}

NO placeholders, NO hallucinated facts, and do NOT exceed character limits for headlines/descriptions. Only use data provided above.
`.trim();

  return { systemMessage, userMessage };
};

// ------ GOOGLE ------
export const buildGoogleAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  return buildUnifiedPrompt(data, 'google');
};

// ------ META / INSTAGRAM ------
export const buildMetaAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  return buildUnifiedPrompt(data, 'meta');
};

// ------ LINKEDIN ------
export const buildLinkedInAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  return buildUnifiedPrompt(data, 'linkedin');
};

// ------ MICROSOFT / BING ------
export const buildMicrosoftAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  return buildUnifiedPrompt(data, 'microsoft');
};
