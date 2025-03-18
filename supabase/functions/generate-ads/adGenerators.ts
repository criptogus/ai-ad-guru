
import { formatCampaignData } from "./utils.ts";
import { generateWithOpenAI } from "./openai.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate Google Ads
export const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Generate Google Ads using the improved expert prompt structure with clearer headline instructions
    const prompt = `
    You are a top-tier **Google Ads expert**, specializing in creating **high-converting search ads** using the latest best practices.

    Your goal is to generate **Google Search Ads** that maximize **curiosity, clicks, and conversions**, following Google's **most effective ad strategies**.
    
    ---
    
    ### 📌 **Ad Creation Guidelines**
    - **Headlines:** Create 3 short, compelling headlines for each ad, each **30 characters max**. Ensure they are relevant to the business.
       - First headline should include the company name or main product/service
       - Second headline should highlight a key benefit or feature
       - Third headline should include a call to action
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
    6. ALWAYS include the company name in at least one headline per ad
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
    
    // Generate Meta/Instagram Ads using the enhanced expert prompt structure
    const prompt = `
    You are a top-tier **Instagram Ads expert**, specializing in **highly engaging and high-converting** ads.

    Your goal is to generate **Instagram Ads (Text + Image)** that maximize **engagement, curiosity, and conversion** using Meta's **latest ad strategies**.
    
    ---
    
    ### 📌 **Ad Creation Guidelines**
    - **Captions:** Short, engaging, **150 characters max**.
    - **Emojis & Hashtags:** Use when relevant to boost engagement.
    - **Call-to-Action (CTA):** Strong and clear (e.g., "Swipe Up!", "Get Yours Today!").
    - **Persuasion Techniques:** Each variation should use a different **psychological trigger**:
      - **Curiosity Hook:** "Why is everyone talking about this?! 👀"
      - **Social Proof:** "🔥 Over 50,000 happy customers!"
      - **Emotional Trigger:** "You deserve this! 💖"
      - **Scarcity/Urgency:** "⏳ Last chance – only 2 days left!"
      - **Exclusive Offer:** "🎁 Special Deal Inside – Swipe Up!"
    
    ---
    
    ### 📌 **Company Information**
    Company: ${campaignData.companyName}  
    Product/Service: ${campaignData.businessDescription || 'No description provided'}  
    Target Audience: ${campaignData.targetAudience || 'General audience'}  
    Brand Tone: ${campaignData.brandTone || 'Professional'}  
    Unique Selling Points: ${uniqueSellingPoints || 'No USPs provided'}  
    Keywords: ${keywords || 'No keywords provided'}
    Call-to-Action: ${callToAction || 'Learn more'}
    
    ---
    
    ### 📌 **Output Format (JSON)**
    Return your answer ONLY as a JSON array with 3 ad objects that look exactly like this, with no additional text before or after:
    [
      {
        "primaryText": "Engaging caption with emojis",
        "headline": "Attention-grabbing headline",
        "description": "Additional details",
        "imagePrompt": "Detailed description for DALL-E image generation that will create a high-quality, professional Instagram ad image"
      },
      ... 2 more ad variations ...
    ]
    
    IMPORTANT:
    1. Match the company's brand tone exactly
    2. Use the company's actual unique selling points
    3. Ensure the ad makes sense for the target audience
    4. The FIRST ad variation will be used first, so make it the most compelling
    5. For image prompts, describe a professional, eye-catching image that would work well on Instagram
    6. Return ONLY the JSON array - no additional text before or after
    `;
    
    console.log("Sending enhanced Instagram Ads prompt to OpenAI...");
    
    return await generateWithOpenAI(prompt);
  } catch (error) {
    console.error("Error in generateMetaAds:", error);
    throw error;
  }
};
