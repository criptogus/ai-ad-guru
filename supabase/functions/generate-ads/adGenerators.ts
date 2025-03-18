
import { formatCampaignData } from "./utils.ts";
import { generateWithOpenAI } from "./openai.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate Google Ads
export const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
  const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
  
  // Generate Google Ads using the advanced prompt structure
  const prompt = `
  You are a top-tier digital marketing expert specializing in high-converting online ads.
  
  Your goal is to create optimized ad variations for a company using the latest conversion-focused ad techniques.
  
  ### Company Information
  Company: ${campaignData.companyName}
  Business Description: ${campaignData.businessDescription}
  Target Audience: ${campaignData.targetAudience}
  Brand Tone: ${campaignData.brandTone}
  Keywords: ${keywords}
  Unique Selling Points: ${uniqueSellingPoints}
  Call-to-Action: ${callToAction}
  
  ## 🎯 Generate Google Search Ads
  Best Practices:
  - Headlines: Max 30 characters each, 3 headlines per ad
  - Descriptions: Max 90 characters each, 2 descriptions per ad
  - Each ad variation must focus on a different persuasion technique, such as:
    - Scarcity/Urgency (e.g., "Limited Time Offer!")
    - Social Proof (e.g., "Trusted by 10,000+ Customers")
    - Problem-Solution (e.g., "Tired of X? Try Y!")
    - Direct Benefit (e.g., "Boost Your Productivity Today!")
    - Emotional Appeal (e.g., "Feel More Confident with Y")
  
  ### Generate 5 Google Ad Variations
  
  Format each ad variation like this:
  {
    "headlines": ["Headline 1", "Headline 2", "Headline 3"],
    "descriptions": ["Description 1", "Description 2"]
  }
  
  Return exactly 5 ad variations in this format as a JSON array.
  `;
  
  console.log("Sending Google Ads prompt to OpenAI...");
  
  return await generateWithOpenAI(prompt);
};

// Generate Meta Ads
export const generateMetaAds = async (campaignData: WebsiteAnalysisResult) => {
  const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
  
  // Generate Meta/Instagram Ads using the advanced prompt structure
  const prompt = `
  You are a top-tier digital marketing expert specializing in high-converting online ads.
  
  Your goal is to create optimized ad variations for a company using the latest conversion-focused ad techniques.
  
  ### Company Information
  Company: ${campaignData.companyName}
  Business Description: ${campaignData.businessDescription}
  Target Audience: ${campaignData.targetAudience}
  Brand Tone: ${campaignData.brandTone}
  Keywords: ${keywords}
  Unique Selling Points: ${uniqueSellingPoints}
  Call-to-Action: ${callToAction}
  
  ## 📸 Generate Instagram Ads (Text + Image)
  Best Practices:
  - Primary Text: Engaging caption with emojis (150-200 characters)
  - Headline: Attention-grabbing headline (max 40 characters)
  - Description: Additional details (max 30 characters)
  - Use emojis & hashtags when relevant
  - Call-to-action MUST be strong (e.g., "Shop Now!", "Sign Up Today!")
  
  ### Generate 3 Instagram Ad Variations
  For each ad, also include an image prompt that DALL-E could use to generate a matching image.
  
  Format each ad variation like this:
  {
    "primaryText": "Engaging caption with emojis",
    "headline": "Attention-grabbing headline",
    "description": "Additional details",
    "imagePrompt": "Detailed description for DALL-E image generation that matches the ad content and brand tone"
  }
  
  Return exactly 3 ad variations in this format as a JSON array.
  `;
  
  console.log("Sending Meta/Instagram Ads prompt to OpenAI...");
  
  return await generateWithOpenAI(prompt);
};
