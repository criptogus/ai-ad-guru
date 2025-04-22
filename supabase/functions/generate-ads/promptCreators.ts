
import { WebsiteAnalysisResult } from "./types.ts";

interface PromptMessages {
  systemMessage: string;
  userMessage: string;
}

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const systemMessage = "You are a professional advertising copywriter specializing in creating engaging Google Ads that drive conversions and follow platform guidelines.";
  
  // Build a comprehensive user prompt with all the website analysis data
  const userMessage = `
Create 5 different Google Search Ads based on the following information:

Company: ${campaignData.companyName || "Not provided"}
Website: ${campaignData.websiteUrl || "Not provided"}
Product/Service: ${campaignData.product || "Not provided"}
Industry: ${campaignData.industry || "Not provided"}
Target Audience: ${campaignData.targetAudience || "Not provided"}
Campaign Objective: ${campaignData.objective || "Not provided"}
Tone of Voice: ${campaignData.brandTone || "Not provided"}
Psychological Trigger: ${mindTrigger || "Not provided"}
Unique Selling Points: ${Array.isArray(campaignData.differentials) ? campaignData.differentials.join(", ") : (campaignData.differentials || "Not provided")}
Company Description: ${campaignData.companyDescription || "Not provided"}
Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : (campaignData.keywords || "Not provided")}
Call to Action: ${Array.isArray(campaignData.callToAction) ? campaignData.callToAction[0] : (campaignData.callToAction || "Not provided")}

Each Google Ad should include:
- 3 headlines (maximum 30 characters each)
- 2 descriptions (maximum 90 characters each)
- A display URL

Format your response as a JSON array with 5 objects. Each object should have these properties:
- headline_1 (string, max 30 chars)
- headline_2 (string, max 30 chars)
- headline_3 (string, max 30 chars)
- description_1 (string, max 90 chars)
- description_2 (string, max 90 chars)
- display_url (string)

Ensure all ads are compelling, follow character limits exactly, and incorporate the psychological trigger.
`.trim();

  return { systemMessage, userMessage };
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const systemMessage = "You are a professional B2B advertising copywriter specializing in creating engaging LinkedIn Ads that drive conversions and establish professional credibility.";
  
  const userMessage = `
Create 5 different LinkedIn Ads based on the following information:

Company: ${campaignData.companyName || "Not provided"}
Website: ${campaignData.websiteUrl || "Not provided"}
Product/Service: ${campaignData.product || "Not provided"}
Industry: ${campaignData.industry || "Not provided"}
Target Audience: ${campaignData.targetAudience || "Not provided"}
Campaign Objective: ${campaignData.objective || "Not provided"}
Tone of Voice: ${campaignData.brandTone || "Not provided"}
Psychological Trigger: ${mindTrigger || "Not provided"}
Unique Selling Points: ${Array.isArray(campaignData.differentials) ? campaignData.differentials.join(", ") : (campaignData.differentials || "Not provided")}
Company Description: ${campaignData.companyDescription || "Not provided"}
Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : (campaignData.keywords || "Not provided")}
Call to Action: ${Array.isArray(campaignData.callToAction) ? campaignData.callToAction[0] : (campaignData.callToAction || "Not provided")}

Each LinkedIn Ad should include:
- A compelling headline
- Primary text (the main content)
- A description (supporting context)
- An image prompt (description for a visual)

Format your response as a JSON array with 5 objects. Each object should have these properties:
- headline (string)
- primaryText (string)
- description (string)
- image_prompt (string)

Ensure all ads are professional, business-oriented, and incorporate the psychological trigger effectively.
`.trim();

  return { systemMessage, userMessage };
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const systemMessage = "You are a professional advertising copywriter specializing in creating engaging Microsoft/Bing Ads that drive conversions and follow platform guidelines.";
  
  const userMessage = `
Create 5 different Microsoft/Bing Ads based on the following information:

Company: ${campaignData.companyName || "Not provided"}
Website: ${campaignData.websiteUrl || "Not provided"}
Product/Service: ${campaignData.product || "Not provided"}
Industry: ${campaignData.industry || "Not provided"}
Target Audience: ${campaignData.targetAudience || "Not provided"}
Campaign Objective: ${campaignData.objective || "Not provided"}
Tone of Voice: ${campaignData.brandTone || "Not provided"}
Psychological Trigger: ${mindTrigger || "Not provided"}
Unique Selling Points: ${Array.isArray(campaignData.differentials) ? campaignData.differentials.join(", ") : (campaignData.differentials || "Not provided")}
Company Description: ${campaignData.companyDescription || "Not provided"}
Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : (campaignData.keywords || "Not provided")}
Call to Action: ${Array.isArray(campaignData.callToAction) ? campaignData.callToAction[0] : (campaignData.callToAction || "Not provided")}

Each Microsoft/Bing Ad should include:
- 3 headlines (maximum 30 characters each)
- 2 descriptions (maximum 90 characters each)
- A display URL

Format your response as a JSON array with 5 objects. Each object should have these properties:
- headline_1 (string, max 30 chars)
- headline_2 (string, max 30 chars)
- headline_3 (string, max 30 chars)
- description_1 (string, max 90 chars)
- description_2 (string, max 90 chars)
- display_url (string)

Ensure all ads are compelling, follow character limits exactly, and incorporate the psychological trigger.
`.trim();

  return { systemMessage, userMessage };
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): PromptMessages {
  const systemMessage = "You are a professional social media advertising copywriter specializing in creating engaging Instagram/Meta Ads that drive engagement and conversions.";
  
  const userMessage = `
Create 5 different Instagram/Meta Ads based on the following information:

Company: ${campaignData.companyName || "Not provided"}
Website: ${campaignData.websiteUrl || "Not provided"}
Product/Service: ${campaignData.product || "Not provided"}
Industry: ${campaignData.industry || "Not provided"}
Target Audience: ${campaignData.targetAudience || "Not provided"}
Campaign Objective: ${campaignData.objective || "Not provided"}
Tone of Voice: ${campaignData.brandTone || "Not provided"}
Psychological Trigger: ${mindTrigger || "Not provided"}
Unique Selling Points: ${Array.isArray(campaignData.differentials) ? campaignData.differentials.join(", ") : (campaignData.differentials || "Not provided")}
Company Description: ${campaignData.companyDescription || "Not provided"}
Keywords: ${Array.isArray(campaignData.keywords) ? campaignData.keywords.join(", ") : (campaignData.keywords || "Not provided")}
Call to Action: ${Array.isArray(campaignData.callToAction) ? campaignData.callToAction[0] : (campaignData.callToAction || "Not provided")}

Each Instagram/Meta Ad should include:
- A compelling headline
- Primary text (the main content/caption)
- A description (supporting context)
- An image prompt (description for a visual without text overlay)

Format your response as a JSON array with 5 objects. Each object should have these properties:
- headline (string)
- primaryText (string)
- description (string)
- image_prompt (string)

Ensure all ads are engaging, social-media friendly, and incorporate the psychological trigger effectively.
`.trim();

  return { systemMessage, userMessage };
}
