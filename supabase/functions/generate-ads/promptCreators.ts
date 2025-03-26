
import { WebsiteAnalysisResult } from "./types.ts";

// Helper function to process mind trigger input
function getMindTriggerInstructions(mindTrigger?: string): string {
  if (!mindTrigger) return "";
  
  // Check if this is a custom trigger or a predefined one
  if (mindTrigger.startsWith("custom:")) {
    return `\n\nIMPORTANT: Use this specific approach in the ads: ${mindTrigger.substring(7)}`;
  }
  
  // Return instructions based on predefined triggers
  const triggerMap: Record<string, string> = {
    // Google ad triggers
    urgency: "Create a sense of urgency and scarcity. Use phrases like 'Limited Time', 'Act Now', or 'Today Only'.",
    social_proof: "Leverage social proof. Mention testimonials, reviews, or how many customers are already using the product/service.",
    problem_solution: "Structure the ads using a problem-solution framework. Identify a pain point first, then present your solution.",
    curiosity: "Create curiosity gaps. Present intriguing but incomplete information that makes people want to learn more.",
    comparison: "Use comparative phrases that position the offering as superior to alternatives or competitors.",
    
    // Meta ad triggers
    lifestyle: "Focus on the aspirational lifestyle that the product enables. Show the positive outcome of using the product/service.",
    before_after: "Highlight transformation and results. Emphasize the contrast between life before and after using the product/service.",
    user_generated: "Create ads that feel like authentic user-generated content. Use a conversational and genuine tone.",
    storytelling: "Use narrative structures that connect emotionally with viewers. Tell a mini-story within the ad.",
    tutorial: "Structure ads like mini-tutorials that demonstrate value through instruction or education.",
    
    // LinkedIn ad triggers
    thought_leadership: "Position the brand as an industry expert or thought leader. Emphasize knowledge and expertise.",
    data_insights: "Include data points, statistics, or research findings that provide valuable business intelligence.",
    professional_growth: "Focus on how the offering helps professionals advance their careers or businesses.",
    industry_trends: "Highlight industry trends and how the product/service helps capitalize on emerging opportunities.",
    case_study: "Structure the ads like mini case studies that showcase real-world business results.",
    
    // Microsoft ad triggers
    specificity: "Use precise numbers and specific details rather than general claims.",
    authority: "Establish expertise and credibility through credentials or trusted associations.",
    emotional: "Appeal to emotions rather than just logic. Connect on a deeper level.",
    question: "Pose questions that make the reader reflect on their needs or challenges.",
    benefit_driven: "Focus entirely on benefits to the user rather than features of the product/service."
  };
  
  return `\n\nIMPORTANT: ${triggerMap[mindTrigger] || `Use this specific approach in the ads: ${mindTrigger}`}`;
}

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = campaignData.companyName || "Our Company";
  const businessDescription = campaignData.businessDescription || "";
  const targetAudience = campaignData.targetAudience || "";
  const keywords = campaignData.keywords?.join(", ") || "";
  const cta = campaignData.callToAction?.[0] || "Learn More";
  const usp = campaignData.uniqueSellingPoints?.join(", ") || "";
  
  // Add mind trigger instructions
  const triggerInstructions = getMindTriggerInstructions(mindTrigger);
  
  return `Create 5 Google Search Ads for ${companyName}.

Business Description: ${businessDescription}
Target Audience: ${targetAudience}
Keywords: ${keywords}
Call to Action: ${cta}
Unique Selling Points: ${usp}

Each Google Search Ad should include:
- 3 Headlines (max 30 characters each)
- 2 Descriptions (max 90 characters each)
- 1 CTA
- Path (max 15 characters each, 2 path segments)

The ads should be optimized for search, highlight benefits, and be compelling within Google's character limits.${triggerInstructions}

Format your response as JSON:
{
  "ads": [
    {
      "headline1": "...",
      "headline2": "...",
      "headline3": "...",
      "description1": "...",
      "description2": "...",
      "path1": "...",
      "path2": "..."
    }
  ]
}`;
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = campaignData.companyName || "Our Company";
  const businessDescription = campaignData.businessDescription || "";
  const targetAudience = campaignData.targetAudience || "";
  const brandTone = campaignData.brandTone || "Professional";
  const usp = campaignData.uniqueSellingPoints?.join(", ") || "";
  
  // Add mind trigger instructions
  const triggerInstructions = getMindTriggerInstructions(mindTrigger);
  
  return `Create 3 Instagram/Meta Ads for ${companyName}.

Business Description: ${businessDescription}
Target Audience: ${targetAudience}
Brand Tone: ${brandTone}
Unique Selling Points: ${usp}

Each Instagram Ad should include:
- Headline (max 40 characters)
- Primary Text (max 125 characters)
- Description (max 30 characters)
- Image Prompt (detailed description for AI image generation)

Create ads that are visually compelling and would perform well on Instagram with strong visual elements.${triggerInstructions}

Format your response as JSON:
{
  "ads": [
    {
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "imagePrompt": "...",
      "format": "feed"
    }
  ]
}`;
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = campaignData.companyName || "Our Company";
  const businessDescription = campaignData.businessDescription || "";
  const targetAudience = campaignData.targetAudience || "";
  const brandTone = campaignData.brandTone || "Professional";
  const usp = campaignData.uniqueSellingPoints?.join(", ") || "";
  
  // Add mind trigger instructions
  const triggerInstructions = getMindTriggerInstructions(mindTrigger);
  
  return `Create 3 LinkedIn Ads for ${companyName}.

Business Description: ${businessDescription}
Target Audience: ${targetAudience}
Brand Tone: ${brandTone}
Unique Selling Points: ${usp}

Each LinkedIn Ad should include:
- Headline (max 50 characters)
- Primary Text (max 150 characters)
- Description (max 70 characters)
- Image Prompt (detailed description for AI image generation)

Create ads that are professional, business-focused, and would appeal to LinkedIn's B2B audience.${triggerInstructions}

Format your response as JSON:
{
  "ads": [
    {
      "headline": "...",
      "primaryText": "...",
      "description": "...",
      "imagePrompt": "...",
      "format": "feed"
    }
  ]
}`;
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const companyName = campaignData.companyName || "Our Company";
  const businessDescription = campaignData.businessDescription || "";
  const targetAudience = campaignData.targetAudience || "";
  const keywords = campaignData.keywords?.join(", ") || "";
  const cta = campaignData.callToAction?.[0] || "Learn More";
  const usp = campaignData.uniqueSellingPoints?.join(", ") || "";
  
  // Add mind trigger instructions
  const triggerInstructions = getMindTriggerInstructions(mindTrigger);
  
  return `Create 5 Microsoft Ads for ${companyName} to appear on Bing Search.

Business Description: ${businessDescription}
Target Audience: ${targetAudience}
Keywords: ${keywords}
Call to Action: ${cta}
Unique Selling Points: ${usp}

Each Microsoft Ad should include:
- 3 Headlines (max 30 characters each)
- 2 Descriptions (max 90 characters each)
- 1 CTA
- Path (max 15 characters each, 2 path segments)

The ads should be optimized for Bing search, highlight benefits, and be slightly more descriptive than Google Ads.${triggerInstructions}

Format your response as JSON:
{
  "ads": [
    {
      "headline1": "...",
      "headline2": "...",
      "headline3": "...",
      "description1": "...",
      "description2": "...",
      "path1": "...",
      "path2": "..."
    }
  ]
}`;
}
