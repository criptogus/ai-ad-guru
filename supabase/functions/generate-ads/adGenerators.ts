
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

// Generate LinkedIn Ads
export const generateLinkedInAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Sample of text to determine language
    console.log("Language sample for LinkedIn ads:", {
      description: campaignData.businessDescription?.substring(0, 100),
      audience: campaignData.targetAudience?.substring(0, 100),
      tone: campaignData.brandTone
    });
    
    // Prompt for LinkedIn Ads
    const prompt = `
    You are a senior marketing professional crafting a cutting-edge LinkedIn Ads campaign in 2025 to drive B2B engagement and conversions.

    ## 🎯 **Generate LinkedIn Ads**

    Your goal is to generate **LinkedIn Ads (Text + Image)** that maximize **professional engagement, business interest, and conversion** using LinkedIn's **latest ad strategies** for ${campaignData.companyName}.
    
    ---
    
    ### 📋 **Ad Format Requirements:**
    - **Headline:** Attention-grabbing, professional, **150 characters max**.
    - **Primary Text:** Engaging opening text, **600 characters max**.
    - **Description:** Clear value proposition, **600 characters max**.
    - **Image Prompt:** Description for an image that would work well on LinkedIn (professional, business-focused).
    
    ### 🎭 **Persuasion Technique Requirements:**
    Each of the 3 ad variations should use a different **B2B psychological trigger**:
    1. **Professional Social Proof:** Highlight industry credentials or existing business clients
    2. **Business Problem-Solution:** Address specific business pain points and solutions
    3. **ROI/Value Based:** Focus on concrete business outcomes and ROI
    
    ---
    
    ### 📌 **Company Information**
    Company: ${campaignData.companyName}  
    Product/Service: ${campaignData.businessDescription || 'No description provided'}  
    Target Audience: ${campaignData.targetAudience || 'Business professionals'}  
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
    - ALL fields (headline, primaryText, description, imagePrompt) MUST be in the SAME LANGUAGE.
    
    ---
    
    ### 📌 **Output Format (JSON)**
    Return your answer ONLY as a JSON array with 3 ad objects that look exactly like this, with no additional text before or after:
    [
      {
        "headline": "Attention-grabbing professional headline",
        "primaryText": "Engaging opening paragraph that appears above the image",
        "description": "Compelling description with clear value proposition for professional audience",
        "imagePrompt": "Detailed description for image generation that will create a high-quality, professional LinkedIn ad image"
      },
      ... 2 more ad variations ...
    ]
    
    IMPORTANT:
    1. Match the company's brand tone exactly - LinkedIn ads should be professional and business-focused
    2. Use the company's actual unique selling points
    3. Ensure the ad makes sense for a B2B/professional target audience
    4. The FIRST ad variation will be used first, so make it the most compelling
    5. For image prompts, describe a professional, business-appropriate image that would work well on LinkedIn
    6. Return ONLY the JSON array - no additional text before or after
    7. Write ALL content in the SAME LANGUAGE as the company information (NEVER mix languages)
    8. Adhere to LinkedIn's character limits: 150 for headline, 600 for primaryText, 600 for description
    9. Reflect 2025 LinkedIn trends like AI integration, future of work, or professional development themes
    10. Incorporate visually compelling but professionally appropriate ideas for images
    `;
    
    console.log("Sending LinkedIn Ads prompt to OpenAI...");
    
    return await generateWithOpenAI(prompt);
  } catch (error) {
    console.error("Error in generateLinkedInAds:", error);
    throw error;
  }
};

// Generate Microsoft Ads
export const generateMicrosoftAds = async (campaignData: WebsiteAnalysisResult) => {
  try {
    const { keywords, callToAction, uniqueSellingPoints } = formatCampaignData(campaignData);
    
    // Sample of text to determine language
    console.log("Language sample for Microsoft ads:", {
      description: campaignData.businessDescription?.substring(0, 100),
      audience: campaignData.targetAudience?.substring(0, 100),
      tone: campaignData.brandTone
    });
    
    // Prompt for Microsoft Ads - similar to Google Ads but with Microsoft-specific adjustments
    const prompt = `
    You are a senior marketing professional designing a state-of-the-art Microsoft Search Ads campaign in 2025 to maximize clicks and conversions on Bing.

    ## 🎯 **Generate Microsoft Search Ads**
    
    Your task is to create 5 compelling Microsoft Search Ad variations with strict character limits for ${campaignData.companyName}.
    
    ### 📋 **Ad Format Requirements:**
    - **Headlines:** Create 3 headlines per ad, each **STRICTLY 30 CHARACTERS OR LESS**
       - First headline should include the company name or main service
       - Second headline should highlight a key benefit or feature
       - Third headline should include a call to action
    - **Descriptions:** Create 2 descriptions per ad, each **STRICTLY 90 CHARACTERS OR LESS**
    
    ### 🎭 **Microsoft Ads-Specific Strategy**
    Each of the 5 ad variations MUST specifically target Microsoft Search/Bing users:
    1. **Bing Search Intent:** Focus on users who specifically use Bing/Microsoft Search
    2. **Microsoft Ecosystem:** Reference Microsoft products/integrations where relevant
    3. **Edge Browser Users:** Target users of Microsoft Edge browser when applicable
    4. **Professional Focus:** Highlight business/enterprise aspects (Bing has higher business user rate)
    5. **Demographic Targeting:** Consider that Bing users tend to be older and more affluent
    
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
    - Each headline MUST be 30 CHARACTERS OR LESS.
    - Each description MUST be 90 CHARACTERS OR LESS.
    - Count characters carefully for each headline and description before submitting.
    
    ---
    
    ### 📌 **Output Format (JSON)**
    Return **5 Microsoft Search Ad Variations** in JSON format:
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
    11. Incorporate 2025 Microsoft/Bing-specific trends and technologies where appropriate
    `;
    
    console.log("Sending Microsoft Ads prompt to OpenAI...");
    
    return await generateWithOpenAI(prompt);
  } catch (error) {
    console.error("Error in generateMicrosoftAds:", error);
    throw error;
  }
};
