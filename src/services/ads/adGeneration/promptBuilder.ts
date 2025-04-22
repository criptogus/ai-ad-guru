
import { CampaignPromptData } from './types/promptTypes';
import { PromptMessages } from './types/promptTypes';

// ------ Helper to handle proper field collapse ------
function fieldOrDoNotInvent(val: any, notProvidedMsg = "Not provided — do not invent"): string {
  if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) return notProvidedMsg;
  if (Array.isArray(val) && val.length === 0) return notProvidedMsg;
  if (Array.isArray(val)) return val.join(', ');
  return val;
}

// ------ GOOGLE ------
export const buildGoogleAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are a world-class performance marketer and expert Google Ads copywriter. Only use the provided data—never invent details, and don't use placeholders.`;

  const userMessage = `
Create 5 high-performing Google Search ads for a company with ONLY the data provided below. 
Omit any section where data is missing—do NOT invent or use generic fill-ins.

Company: ${fieldOrDoNotInvent(data.companyName)}
Website: ${fieldOrDoNotInvent(data.websiteUrl)}
Product/Service: ${fieldOrDoNotInvent(data.product)}
Industry: ${fieldOrDoNotInvent(data.industry)}
Target Audience: ${fieldOrDoNotInvent(data.targetAudience)}
Campaign Objective: ${fieldOrDoNotInvent(data.objective)}
Tone of Voice: ${fieldOrDoNotInvent(data.brandTone)}
Psychological Trigger: ${fieldOrDoNotInvent(data.mindTrigger, "None")}
Unique Selling Points: ${fieldOrDoNotInvent(data.differentials)}
Company Description: ${fieldOrDoNotInvent(data.companyDescription)}
Keywords: ${fieldOrDoNotInvent(data.keywords)}
Call to Action: ${fieldOrDoNotInvent(
    Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction
)}

LANGUAGE: ${data.language || 'English'}
Respond using this language. 

Format the output as a JSON array with 5 objects, strictly following this format:
{
  "headline_1": "...",    // max 30 chars
  "headline_2": "...",    // max 30 chars
  "headline_3": "...",    // max 30 chars
  "description_1": "...", // max 90 chars
  "description_2": "...", // max 90 chars
  "display_url": "www.example.com/path"   // display URL
}
NO placeholders, NO hallucinated facts, and do NOT exceed char limits. Only use data above.
`.trim();

  return { systemMessage, userMessage };
};

// ------ META / INSTAGRAM ------
export const buildMetaAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are a world-class Meta Ads strategist. Create 5 Instagram/Meta ad variations. Only use the provided campaign and brand data. You must NOT invent any detail.`;

  const userMessage = `
Create 5 Instagram Ads using ONLY the data below. 
Do not make up or invent anything; omit any data not provided.

Company: ${fieldOrDoNotInvent(data.companyName)}
Website: ${fieldOrDoNotInvent(data.websiteUrl)}
Product/Service: ${fieldOrDoNotInvent(data.product)}
Industry: ${fieldOrDoNotInvent(data.industry)}
Target Audience: ${fieldOrDoNotInvent(data.targetAudience)}
Campaign Objective: ${fieldOrDoNotInvent(data.objective)}
Tone of Voice: ${fieldOrDoNotInvent(data.brandTone)}
Psychological Trigger: ${fieldOrDoNotInvent(data.mindTrigger, "None")}
Unique Selling Points: ${fieldOrDoNotInvent(data.differentials)}
Company Description: ${fieldOrDoNotInvent(data.companyDescription)}
Keywords: ${fieldOrDoNotInvent(data.keywords)}
Call to Action: ${fieldOrDoNotInvent(
    Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction
)}

LANGUAGE: ${data.language || 'English'}
Respond using this language.

Format output as a JSON array with 5 objects, strictly following:
{
  "headline": "...",       // concise attention grabber
  "primaryText": "...",    // main caption (emotional/engaging, but only use given info)
  "description": "...",    // supporting context/benefits (if info available)
  "image_prompt": "..."    // a realistic prompt for an ad image, with NO text overlay, suitable for Instagram.
}
NO invented features/claims. Do NOT use placeholders. Only use fields from campaign data.
`.trim();

  return { systemMessage, userMessage };
};

// ------ LINKEDIN ------
export const buildLinkedInAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are a world-class B2B copywriter and LinkedIn Ads strategist. Create 5 professional LinkedIn ads. Use ONLY provided data, and never invent or guess.`;

  const userMessage = `
Create 5 LinkedIn Ads for a campaign using ONLY the data below. 
Do NOT invent or fill in missing details—omit fields not provided.

Company: ${fieldOrDoNotInvent(data.companyName)}
Website: ${fieldOrDoNotInvent(data.websiteUrl)}
Product/Service: ${fieldOrDoNotInvent(data.product)}
Industry: ${fieldOrDoNotInvent(data.industry)}
Target Audience: ${fieldOrDoNotInvent(data.targetAudience)}
Campaign Objective: ${fieldOrDoNotInvent(data.objective)}
Tone of Voice: ${fieldOrDoNotInvent(data.brandTone)}
Psychological Trigger: ${fieldOrDoNotInvent(data.mindTrigger, "None")}
Unique Selling Points: ${fieldOrDoNotInvent(data.differentials)}
Company Description: ${fieldOrDoNotInvent(data.companyDescription)}
Keywords: ${fieldOrDoNotInvent(data.keywords)}
Call to Action: ${fieldOrDoNotInvent(
    Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction
)}

LANGUAGE: ${data.language || 'English'}
Respond using this language.

Format output as a JSON array with 5 objects, each with:
{
  "headline": "...",        // professional, concise, only supplied facts
  "primaryText": "...",     // main caption for business (no fabrications)
  "description": "...",     // supporting statement if info exists
  "image_prompt": "..."     // professional ad creative image prompt, NO text overlay, for LinkedIn
}
NO "lorem ipsum", NO invented claims, NO placeholders—just use what is above.
`.trim();

  return { systemMessage, userMessage };
};

// ------ MICROSOFT / BING ------
export const buildMicrosoftAdsPrompt = (data: CampaignPromptData): PromptMessages => {
  const systemMessage = `You are a world-class Microsoft/Bing Ads copywriter. Write ONLY real, performance-focused ads using supplied data—NO inventions or placeholders.`;

  const userMessage = `
Create 5 Microsoft/Bing Search Ads for a company using ONLY the data below. 
Do NOT invent or use filler—only use data as provided.

Company: ${fieldOrDoNotInvent(data.companyName)}
Website: ${fieldOrDoNotInvent(data.websiteUrl)}
Product/Service: ${fieldOrDoNotInvent(data.product)}
Industry: ${fieldOrDoNotInvent(data.industry)}
Target Audience: ${fieldOrDoNotInvent(data.targetAudience)}
Campaign Objective: ${fieldOrDoNotInvent(data.objective)}
Tone of Voice: ${fieldOrDoNotInvent(data.brandTone)}
Psychological Trigger: ${fieldOrDoNotInvent(data.mindTrigger, "None")}
Unique Selling Points: ${fieldOrDoNotInvent(data.differentials)}
Company Description: ${fieldOrDoNotInvent(data.companyDescription)}
Keywords: ${fieldOrDoNotInvent(data.keywords)}
Call to Action: ${fieldOrDoNotInvent(
    Array.isArray(data.callToAction) ? data.callToAction[0] : data.callToAction
)}

LANGUAGE: ${data.language || 'English'}
Respond using this language.

Format output as a JSON array with 5 objects, strictly in this format:
{
  "headline_1": "...",    // max 30 chars
  "headline_2": "...",    // max 30 chars
  "headline_3": "...",    // max 30 chars
  "description_1": "...", // max 90 chars
  "description_2": "...", // max 90 chars
  "display_url": "www.example.com/path"
}
NO hallucinations, NO placeholders, strictly follow character limits and field structure.
`.trim();

  return { systemMessage, userMessage };
};
