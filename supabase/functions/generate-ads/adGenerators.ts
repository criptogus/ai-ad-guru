
import { formatCampaignData } from "./utils.ts";
import { generateWithOpenAI } from "./openai.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate Google Ads
export const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Generate Google Ads using the improved expert prompt structure
    const prompt = `
    You are a top-tier **Google Ads expert**, specializing in creating **high-converting search ads** using the latest best practices.

    Your goal is to generate **Google Search Ads** that maximize **curiosity, clicks, and conversions**, following Google's **most effective ad strategies**.
    
    ---
    
    ### 📌 **Ad Creation Guidelines**
    - **Headlines:** Short, compelling, **30 characters max**.
    - **Descriptions:** Persuasive, action-driven, **90 characters max**.
    - **Ad Variations:** Create **5 variations** to test different persuasion techniques.
    - **Call-to-Action (CTA):** Use direct action words (e.g., "Shop Now", "Try for Free").
    - **Persuasion Techniques:** Each variation should focus on a different high-impact approach:
      - **Curiosity Hook:** "This Simple Trick Will [Solve Problem]!"
      - **Urgency/Scarcity:** "Only 3 Spots Left – Book Now!"
      - **Social Proof:** "Trusted by 10,000+ Customers!"
      - **Emotional Trigger:** "Feel More Confident with [Product]!"
      - **Problem-Solution:** "Tired of [Pain Point]? Try [Solution] Today!"
    
    ---
    
    ### 📌 **Company Information**
    Company: ${campaignData.companyName}  
    Product/Service: ${campaignData.businessDescription || 'No description provided'}  
    Target Audience: ${campaignData.targetAudience || 'General audience'}  
    Keywords: ${keywords || 'No keywords provided'}  
    Unique Selling Points (USPs): ${uniqueSellingPoints || 'No USPs provided'}  
    Brand Tone: ${campaignData.brandTone || 'Professional'}  
    Call-to-Action: ${callToAction || 'Learn more'}
    
    ---
    
    ### 📌 **Output Format (JSON)**
    Return **5 Google Search Ad Variations** in JSON format:
    \`\`\`json
    [
      {
        "headlines": ["Headline 1", "Headline 2", "Headline 3"],
        "descriptions": ["Description 1", "Description 2"]
      },
      ... 4 more ad variations ...
    ]
    \`\`\`

    IMPORTANT:
    1. Match the company's brand tone exactly
    2. Use the company's actual unique selling points
    3. Ensure the ad makes sense for the target audience
    4. The FIRST ad variation will be used first, so make it the most compelling
    5. Return ONLY the JSON array - no additional text before or after
    `;
    
    console.log("Sending improved Google Ads prompt to OpenAI...");
    
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
