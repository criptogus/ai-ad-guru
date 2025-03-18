
import { formatCampaignData } from "./utils.ts";
import { generateWithOpenAI } from "./openai.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate Google Ads
export const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Sample of text to determine language
    console.log("Language sample:", {
      description: campaignData.businessDescription?.substring(0, 100),
      audience: campaignData.targetAudience?.substring(0, 100),
      tone: campaignData.brandTone
    });
    
    // Updated prompt for Google Ads that is industry-agnostic
    const prompt = `
    You are a senior marketing professional designing a state-of-the-art Google Search Ads campaign in 2025 to maximize clicks and conversions.

    ## 🎯 **1. Generate Google Search Ads**
    
    Your task is to create 5 compelling Google Search Ad variations with strict character limits for ${campaignData.companyName}.
    
    ### 📋 **Ad Format Requirements:**
    - **Headlines:** Create 3 headlines per ad, each **STRICTLY 30 CHARACTERS OR LESS**
       - First headline should include the company name or main service
       - Second headline should highlight a key benefit or feature
       - Third headline should include a call to action
    - **Descriptions:** Create 2 descriptions per ad, each **STRICTLY 90 CHARACTERS OR LESS**
    
    ### 🎭 **Persuasion Technique Requirements:**
    Each of the 5 ad variations MUST use a different persuasion technique:
    1. **Scarcity/Urgency:** Create a sense of limited time or availability
    2. **Social Proof:** Emphasize customer base, reviews, or testimonials
    3. **Problem-Solution:** Address a pain point and how the company solves it
    4. **Direct Benefit:** Clearly state what the customer gains
    5. **Emotional Appeal:** Connect with feelings and aspirations
    
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
    
    ### 📌 **CRITICAL LANGUAGE INSTRUCTIONS - EXTREMELY IMPORTANT**
    - You MUST write ALL ad content in the SAME LANGUAGE as the company information above.
    - If the company's business description is in Portuguese, all ad content must be in Portuguese.
    - If the company's business description is in Spanish, all ad content must be in Spanish.
    - If the company's business description is in English, all ad content must be in English.
    - NEVER mix languages in any part of the ad.
    - ALL headlines and descriptions MUST be in the SAME LANGUAGE.
    
    ---
    
    ### 📌 **CRITICAL CHARACTER LIMIT ENFORCEMENT**
    - Each headline MUST be 30 CHARACTERS OR LESS. This is a strict Google requirement.
    - Each description MUST be 90 CHARACTERS OR LESS. This is a strict Google requirement.
    - Count characters carefully for each headline and description before submitting.
    
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
    7. EVERY headline MUST be relevant to the specific business ${campaignData.companyName}
    8. DO NOT create generic headlines that could apply to any business
    9. Write ALL content in the SAME LANGUAGE as the company information (NEVER mix languages)
    10. STRICTLY adhere to character limits: 30 chars for headlines, 90 chars for descriptions
    11. Incorporate 2025 trends like AI-powered solutions or voice search compatibility where appropriate
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
    
    // Sample of text to determine language
    console.log("Language sample for Meta ads:", {
      description: campaignData.businessDescription?.substring(0, 100),
      audience: campaignData.targetAudience?.substring(0, 100),
      tone: campaignData.brandTone
    });
    
    // Updated prompt for Meta/Instagram Ads that is industry-agnostic
    const prompt = `
    You are a senior marketing professional crafting a cutting-edge Instagram Ads campaign in 2025 to drive clicks and conversions.

    Your goal is to generate **Instagram Ads (Text + Image)** that maximize **engagement, curiosity, and conversion** using Meta's **latest ad strategies** for ${campaignData.companyName}.
    
    ---
    
    ### 📌 **Ad Creation Guidelines**
    - **Captions:** Short, engaging, **150 characters max**.
    - **Emojis & Hashtags:** Use when relevant to boost engagement.
    - **Call-to-Action (CTA):** Strong and clear, IN THE SAME LANGUAGE as the company information.
    - **Persuasion Techniques:** Each variation should use a different **psychological trigger**:
      - **Curiosity Hook:** Create curiosity about specific solutions
      - **Social Proof:** Highlight customer base or testimonials 
      - **Emotional Trigger:** Connect emotionally with the target audience's needs
    
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
    
    ### 📌 **CRITICAL LANGUAGE INSTRUCTIONS - EXTREMELY IMPORTANT**
    - You MUST write ALL ad content in the SAME LANGUAGE as the company information above.
    - If the company's business description is in Portuguese, all ad content must be in Portuguese.
    - If the company's business description is in Spanish, all ad content must be in Spanish.
    - If the company's business description is in English, all ad content must be in English.
    - NEVER mix languages in any part of the ad.
    - ALL fields (primaryText, headline, description) MUST be in the SAME LANGUAGE.
    - If the business is Portuguese, use Portuguese CTAs like "Deslize para cima" instead of English "Swipe Up".
    - If company info is in Portuguese, ALL generated terms must be in Portuguese.
    
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
    7. Write ALL content in the SAME LANGUAGE as the company information (NEVER mix languages)
    8. If company info is in Portuguese, use Portuguese CTAs and terms (not English)
    9. Reflect 2025 Instagram trends like short-form video elements or interactive AR features
    10. Incorporate visually compelling ideas that will drive engagement
    `;
    
    console.log("Sending enhanced Instagram Ads prompt to OpenAI...");
    
    return await generateWithOpenAI(prompt);
  } catch (error) {
    console.error("Error in generateMetaAds:", error);
    throw error;
  }
};
