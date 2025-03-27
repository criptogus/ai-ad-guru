
// Prompt creators for different ad platforms
import { WebsiteAnalysisResult } from "./types.ts";

/**
 * Generate a prompt for Google Ads
 */
export function generateGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const {
    companyName,
    businessDescription,
    targetAudience,
    brandTone,
    keywords,
    callToAction,
    uniqueSellingPoints,
    websiteUrl
  } = campaignData;

  // Format arrays for display in the prompt
  const keywordsText = Array.isArray(keywords) ? keywords.join(", ") : keywords || "N/A";
  const ctaText = Array.isArray(callToAction) ? callToAction.join(", ") : callToAction || "N/A";
  const uspText = Array.isArray(uniqueSellingPoints) ? uniqueSellingPoints.join(", ") : uniqueSellingPoints || "N/A";

  // Main prompt
  let prompt = `Create 5 high-converting Google search ads for ${companyName}. 

Business Information:
- Business Name: ${companyName}
- Description: ${businessDescription || "N/A"}
- Target Audience: ${targetAudience || "N/A"}
- Brand Tone: ${brandTone || "Professional but friendly"}
- Website: ${websiteUrl || "N/A"}
- Keywords: ${keywordsText}
- Call to Action: ${ctaText}
- Unique Selling Points: ${uspText}

Requirements:
1. Each ad must have 3 headlines (max 30 characters each)
2. Each ad must have 2 descriptions (max 90 characters each)
3. Output must be in JSON format for direct implementation
4. Headlines should be attention-grabbing and include keywords
5. Descriptions should highlight benefits and include a clear CTA

Respond in this exact JSON format:
{
  "google_ads": [
    {
      "headlines": ["Headline 1", "Headline 2", "Headline 3"],
      "descriptions": ["Description line 1 with a strong benefit statement.", "Description line 2 with a clear call to action."]
    },
    // 4 more ad variations...
  ]
}`;

  // Add mind trigger if provided
  if (mindTrigger) {
    prompt += `\n\nIMPORTANT: Use the "${mindTrigger}" psychological trigger in your ad copy. Make sure the messaging leverages this trigger effectively to increase conversions.`;
  }

  return prompt;
}

/**
 * Generate a prompt for Meta/Instagram Ads
 */
export function generateMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const {
    companyName,
    businessDescription,
    targetAudience,
    brandTone,
    keywords,
    callToAction,
    uniqueSellingPoints,
    websiteUrl
  } = campaignData;

  // Format arrays for display in the prompt
  const keywordsText = Array.isArray(keywords) ? keywords.join(", ") : keywords || "N/A";
  const ctaText = Array.isArray(callToAction) ? callToAction.join(", ") : callToAction || "N/A";
  const uspText = Array.isArray(uniqueSellingPoints) ? uniqueSellingPoints.join(", ") : uniqueSellingPoints || "N/A";

  // Main prompt
  let prompt = `Create 5 engaging Instagram/Meta ads for ${companyName}.

Business Information:
- Business Name: ${companyName}
- Description: ${businessDescription || "N/A"}
- Target Audience: ${targetAudience || "N/A"}
- Brand Tone: ${brandTone || "Engaging and visual"}
- Website: ${websiteUrl || "N/A"}
- Keywords: ${keywordsText}
- Call to Action: ${ctaText}
- Unique Selling Points: ${uspText}

Requirements:
1. Each ad must have a headline (max 40 characters)
2. Each ad must have primary text (compelling Instagram caption, 125-2000 characters)
3. Each ad must have a description (max 30 characters)
4. Each ad must have an image prompt for AI image generation
5. The content should be engaging, visual, and include relevant hashtags
6. Output must be in JSON format for direct implementation

Respond in this exact JSON format:
{
  "meta_ads": [
    {
      "headline": "Short, catchy headline",
      "primaryText": "Engaging caption that would work well on Instagram with #relevant #hashtags",
      "description": "Short call-to-action",
      "imagePrompt": "Detailed prompt for generating an image that would be perfect for this ad"
    },
    // 4 more ad variations...
  ]
}`;

  // Add mind trigger if provided
  if (mindTrigger) {
    prompt += `\n\nIMPORTANT: Use the "${mindTrigger}" psychological trigger in your ad copy. Make sure the messaging leverages this trigger effectively to increase engagement and conversions.`;
    
    // Add specific guidance based on the trigger type
    if (mindTrigger === "lifestyle") {
      prompt += `\nFor lifestyle trigger: Focus on aspirational imagery and how the product/service fits into an idealized lifestyle. The image prompts should show people enjoying life with the product.`;
    } else if (mindTrigger === "user_generated") {
      prompt += `\nFor user-generated content trigger: Make the content feel authentic and relatable, as if created by real users. The image prompts should look natural and unpolished, like something a real customer would share.`;
    } else if (mindTrigger === "tutorial") {
      prompt += `\nFor tutorial/how-to trigger: Focus on educational value and practical usage. The image prompts should demonstrate the product in use or show a before/after scenario.`;
    }
  }

  return prompt;
}

/**
 * Generate a prompt for LinkedIn Ads
 */
export function generateLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const {
    companyName,
    businessDescription,
    targetAudience,
    brandTone,
    keywords,
    callToAction,
    uniqueSellingPoints,
    websiteUrl
  } = campaignData;

  // Format arrays for display in the prompt
  const keywordsText = Array.isArray(keywords) ? keywords.join(", ") : keywords || "N/A";
  const ctaText = Array.isArray(callToAction) ? callToAction.join(", ") : callToAction || "N/A";
  const uspText = Array.isArray(uniqueSellingPoints) ? uniqueSellingPoints.join(", ") : uniqueSellingPoints || "N/A";

  // Main prompt
  let prompt = `Create 5 professional LinkedIn ads for ${companyName}.

Business Information:
- Business Name: ${companyName}
- Description: ${businessDescription || "N/A"}
- Target Audience: ${targetAudience || "N/A"}
- Brand Tone: ${brandTone || "Professional and authoritative"}
- Website: ${websiteUrl || "N/A"}
- Keywords: ${keywordsText}
- Call to Action: ${ctaText}
- Unique Selling Points: ${uspText}

Requirements:
1. Each ad must have a headline (max 50 characters)
2. Each ad must have primary text (200-600 characters, professional LinkedIn style)
3. Each ad must have a description/CTA (max 30 characters)
4. Each ad must have an image prompt for AI image generation (professional context)
5. Content should be business-focused, professional, and value-driven
6. Output must be in JSON format for direct implementation

Respond in this exact JSON format:
{
  "linkedin_ads": [
    {
      "headline": "Professional headline targeting business audience",
      "primaryText": "Professional copy that would work well on LinkedIn, focused on business value, professional development, or industry insights",
      "description": "Professional call-to-action",
      "imagePrompt": "Detailed prompt for generating a professional business-oriented image for LinkedIn"
    },
    // 4 more ad variations...
  ]
}`;

  // Add mind trigger if provided
  if (mindTrigger) {
    prompt += `\n\nIMPORTANT: Use the "${mindTrigger}" psychological trigger in your ad copy. Make sure the messaging leverages this trigger effectively for a professional B2B audience on LinkedIn.`;
    
    // Add specific guidance based on the trigger type
    if (mindTrigger === "thought_leadership") {
      prompt += `\nFor thought leadership trigger: Position the company as an industry authority with valuable insights. The tone should be authoritative but accessible.`;
    } else if (mindTrigger === "professional_growth") {
      prompt += `\nFor professional growth trigger: Focus on how the product/service helps professionals advance their careers or businesses. Emphasize skill development, efficiency gains, or competitive advantage.`;
    } else if (mindTrigger === "data_insights") {
      prompt += `\nFor data insights trigger: Include specific statistics, research findings, or industry trends that validate the value proposition. The tone should be analytical and evidence-based.`;
    }
  }

  return prompt;
}

/**
 * Generate a prompt for Microsoft Ads
 */
export function generateMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const {
    companyName,
    businessDescription,
    targetAudience,
    brandTone,
    keywords,
    callToAction,
    uniqueSellingPoints,
    websiteUrl
  } = campaignData;

  // Format arrays for display in the prompt
  const keywordsText = Array.isArray(keywords) ? keywords.join(", ") : keywords || "N/A";
  const ctaText = Array.isArray(callToAction) ? callToAction.join(", ") : callToAction || "N/A";
  const uspText = Array.isArray(uniqueSellingPoints) ? uniqueSellingPoints.join(", ") : uniqueSellingPoints || "N/A";

  // Main prompt
  let prompt = `Create 5 high-converting Microsoft search ads for ${companyName}.

Business Information:
- Business Name: ${companyName}
- Description: ${businessDescription || "N/A"}
- Target Audience: ${targetAudience || "N/A"}
- Brand Tone: ${brandTone || "Professional and clear"}
- Website: ${websiteUrl || "N/A"}
- Keywords: ${keywordsText}
- Call to Action: ${ctaText}
- Unique Selling Points: ${uspText}

Requirements:
1. Each ad must have 3 headlines (max 30 characters each)
2. Each ad must have 2 descriptions (max 90 characters each)
3. Output must be in JSON format for direct implementation
4. Headlines should be attention-grabbing and include keywords
5. Descriptions should highlight benefits and include a clear CTA
6. Consider Microsoft's demographics (often professionals, higher average age than Google)

Respond in this exact JSON format:
{
  "microsoft_ads": [
    {
      "headlines": ["Headline 1", "Headline 2", "Headline 3"],
      "descriptions": ["Description line 1 with a strong benefit statement.", "Description line 2 with a clear call to action."]
    },
    // 4 more ad variations...
  ]
}`;

  // Add mind trigger if provided
  if (mindTrigger) {
    prompt += `\n\nIMPORTANT: Use the "${mindTrigger}" psychological trigger in your ad copy. Make sure the messaging leverages this trigger effectively to increase conversions in the Microsoft Ads ecosystem.`;
  }

  return prompt;
}
