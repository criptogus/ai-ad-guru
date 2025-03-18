
import { formatCampaignData } from "./utils.ts";
import { generateWithOpenAI } from "./openai.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate Google Ads
export const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Generate Google Ads using the advanced prompt structure
    const prompt = `
    You are a top-tier digital marketing expert specializing in high-converting online ads.
    
    Your goal is to create 5 optimized Google Ad variations for a company using the latest conversion-focused ad techniques.
    
    ### Company Information
    Company: ${campaignData.companyName}
    Business Description: ${campaignData.businessDescription || 'No description provided'}
    Target Audience: ${campaignData.targetAudience || 'General audience'}
    Brand Tone: ${campaignData.brandTone || 'Professional'}
    Keywords: ${keywords || 'No keywords provided'}
    Unique Selling Points: ${uniqueSellingPoints || 'No USPs provided'}
    Call-to-Action: ${callToAction || 'Learn more'}
    
    ## Create 5 Google Search Ads
    Requirements:
    - Headlines: Max 30 characters each, 3 headlines per ad
    - Descriptions: Max 90 characters each, 2 descriptions per ad
    - Each ad variation must focus on a different persuasion technique, such as:
      - Scarcity/Urgency (e.g., "Limited Time Offer!")
      - Social Proof (e.g., "Trusted by 10,000+ Customers")
      - Problem-Solution (e.g., "Tired of X? Try Y!")
      - Direct Benefit (e.g., "Boost Your Productivity Today!")
      - Emotional Appeal (e.g., "Feel More Confident with Y")
    
    ### Format
    Return your answer ONLY as a JSON array with 5 ad objects that look exactly like this, with no additional text before or after:
    [
      {
        "headlines": ["Headline 1", "Headline 2", "Headline 3"],
        "descriptions": ["Description 1", "Description 2"]
      },
      ... 4 more ad variations ...
    ]
    `;
    
    console.log("Sending Google Ads prompt to OpenAI...");
    
    return await generateWithOpenAI(prompt);
  } catch (error) {
    console.error("Error in generateGoogleAds:", error);
    throw error;
  }
};

// Generate Meta Ads
export const generateMetaAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Generate Meta/Instagram Ads using the advanced prompt structure
    const prompt = `
    You are a top-tier digital marketing expert specializing in high-converting online ads.
    
    Your goal is to create 3 optimized Instagram/Meta ad variations for a company using the latest conversion-focused ad techniques.
    
    ### Company Information
    Company: ${campaignData.companyName}
    Business Description: ${campaignData.businessDescription || 'No description provided'}
    Target Audience: ${campaignData.targetAudience || 'General audience'}
    Brand Tone: ${campaignData.brandTone || 'Professional'}
    Keywords: ${keywords || 'No keywords provided'}
    Unique Selling Points: ${uniqueSellingPoints || 'No USPs provided'}
    Call-to-Action: ${callToAction || 'Learn more'}
    
    ## Create 3 Instagram Ads
    Requirements:
    - Primary Text: Engaging caption with emojis (150-200 characters)
    - Headline: Attention-grabbing headline (max 40 characters)
    - Description: Additional details (max 30 characters)
    - Include an image prompt that DALL-E could use to generate a matching image
    
    ### Format
    Return your answer ONLY as a JSON array with 3 ad objects that look exactly like this, with no additional text before or after:
    [
      {
        "primaryText": "Engaging caption with emojis",
        "headline": "Attention-grabbing headline",
        "description": "Additional details",
        "imagePrompt": "Detailed description for DALL-E image generation"
      },
      ... 2 more ad variations ...
    ]
    `;
    
    console.log("Sending Meta/Instagram Ads prompt to OpenAI...");
    
    return await generateWithOpenAI(prompt);
  } catch (error) {
    console.error("Error in generateMetaAds:", error);
    throw error;
  }
};
