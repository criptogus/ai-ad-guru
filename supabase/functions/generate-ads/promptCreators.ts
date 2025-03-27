
import { WebsiteAnalysisResult } from "./types.ts";

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `Create 5 high-converting Google search ads for ${campaignData.companyName}. 
  
  The business is: ${campaignData.businessDescription}
  
  Target audience: ${campaignData.targetAudience}
  
  Key selling points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints}
  
  Brand tone: ${campaignData.brandTone}
  
  Each ad should include:
  - 3 headlines (max 30 characters each)
  - 2 descriptions (max 90 characters each)
  
  IMPORTANT INSTRUCTIONS:
  - Be concise and impactful - every character counts
  - Focus on benefits, not features
  - Include at least one clear call-to-action
  - Use natural, conversational language
  - Avoid generic phrases like "Contact Us Today" unless it's truly relevant
  - Match the brand's tone exactly
  - DO NOT include placeholder text or sample ads - only create real, usable ads
  - Output in the EXACT language as the business description provided
  
  Format your response as a JSON array of ad objects with properties: headlines (array of 3 strings) and descriptions (array of 2 strings).`;
  
  if (mindTrigger) {
    const triggerPrompts = {
      urgency: "Create a sense of urgency with deadline-focused language, limited-time offers, or emphasizing what the user might miss. Use phrases like 'Limited Time', 'Act Now', or 'Don't Miss Out'.",
      authority: "Position the brand as an authority or expert in their field. Mention credentials, experience, awards, or industry recognition to build trust.",
      curiosity: "Spark curiosity by hinting at valuable information or solutions without fully revealing them. Use intriguing questions or statements that make users want to learn more.",
      social_proof: "Leverage the power of social validation by mentioning customer counts, reviews, testimonials, or popularity metrics.",
      scarcity: "Emphasize limited availability, exclusivity, or high demand to create a fear of missing out. Use phrases like 'Limited Stock', 'Few Spots Left', or 'While Supplies Last'.",
      exclusivity: "Make the audience feel special by offering exclusive access, membership, or benefits that aren't available to everyone.",
      emotion: "Connect on an emotional level by addressing pain points, aspirations, or desires directly. Use emotionally charged language that resonates with the target audience.",
      novelty: "Highlight what's new, innovative, or different about the offering. Focus on unique aspects that competitors don't have.",
      user_generated: "Create ads that feel like authentic user testimonials or reviews. Use a conversational, first-person perspective that sounds like a real customer.",
      credibility: "Establish trust through facts, statistics, certifications, or guarantees that prove the brand's reliability and effectiveness.",
      value: "Focus on exceptional value, ROI, or the benefits versus cost. Highlight savings, efficiency, or long-term benefits.",
      discount: "Emphasize special pricing, discounts, or promotional offers available now. Use specific numbers and percentages when possible."
    };

    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. ${(triggerPrompts as any)[mindTrigger] || "Focus on creating copy that triggers this specific psychological response in the audience."} Integrate this trigger naturally into each ad.`;
  }
  
  return basePrompt;
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `Create 5 high-converting LinkedIn ads for ${campaignData.companyName}. 
  
  The business is: ${campaignData.businessDescription}
  
  Target audience: ${campaignData.targetAudience}
  
  Key selling points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints}
  
  Brand tone: ${campaignData.brandTone}
  
  IMPORTANT INSTRUCTIONS:
  - Write in a professional, business-focused tone appropriate for LinkedIn
  - Focus on career advancement, professional development, or business growth
  - Be specific about professional benefits and outcomes
  - Include relevant industry terminology where appropriate
  - Craft ads that would appeal to business professionals
  - Output in the EXACT language as the business description provided
  - Include relevant, professional hashtags - no more than 3
  
  Each ad should include:
  - A headline (max 50 characters)
  - Primary text (main post content, 1-2 paragraphs)
  - A description (max 70 characters)
  - An image prompt that would generate a relevant image for the ad
  - Format (string, always use "single-image")
  - Hashtags (array of 3 relevant hashtags without # symbol)
  
  Format your response as a JSON array of ad objects with properties: headline, primaryText, description, imagePrompt, format, and hashtags.`;
  
  if (mindTrigger) {
    const triggerPrompts = {
      urgency: "Create a sense of urgency with deadline-focused language, limited-time offers, or emphasizing what the user might miss. Use phrases like 'Limited Time', 'Act Now', or 'Don't Miss Out'.",
      authority: "Position the brand as an authority or expert in their field. Mention credentials, experience, awards, or industry recognition to build trust.",
      curiosity: "Spark curiosity by hinting at valuable information or solutions without fully revealing them. Use intriguing questions or statements that make users want to learn more.",
      social_proof: "Leverage the power of social validation by mentioning customer counts, reviews, testimonials, or popularity metrics.",
      scarcity: "Emphasize limited availability, exclusivity, or high demand to create a fear of missing out. Use phrases like 'Limited Stock', 'Few Spots Left', or 'While Supplies Last'.",
      exclusivity: "Make the audience feel special by offering exclusive access, membership, or benefits that aren't available to everyone.",
      emotion: "Connect on an emotional level by addressing pain points, aspirations, or desires directly. Use emotionally charged language that resonates with the target audience.",
      novelty: "Highlight what's new, innovative, or different about the offering. Focus on unique aspects that competitors don't have.",
      user_generated: "Create ads that feel like authentic user testimonials or reviews. Use a conversational, first-person perspective that sounds like a real customer.",
      credibility: "Establish trust through facts, statistics, certifications, or guarantees that prove the brand's reliability and effectiveness.",
      value: "Focus on exceptional value, ROI, or the benefits versus cost. Highlight savings, efficiency, or long-term benefits.",
      discount: "Emphasize special pricing, discounts, or promotional offers available now. Use specific numbers and percentages when possible."
    };

    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. ${(triggerPrompts as any)[mindTrigger] || "Focus on creating copy that triggers this specific psychological response in the audience."} Integrate this trigger naturally into each ad while maintaining a professional LinkedIn tone.`;
  }
  
  return basePrompt;
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `Create 5 high-converting Microsoft Ads for ${campaignData.companyName}. 
  
  The business is: ${campaignData.businessDescription}
  
  Target audience: ${campaignData.targetAudience}
  
  Key selling points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints}
  
  Brand tone: ${campaignData.brandTone}
  
  IMPORTANT INSTRUCTIONS:
  - Be concise and impactful - every character counts
  - Focus on benefits, not features
  - Include at least one clear call-to-action
  - Use natural, conversational language
  - Avoid generic phrases like "Contact Us Today" unless it's truly relevant
  - Match the brand's tone exactly
  - DO NOT include placeholder text or sample ads - only create real, usable ads
  - Output in the EXACT language as the business description provided
  
  Each ad should include:
  - 3 headlines (max 30 characters each)
  - 2 descriptions (max 90 characters each)
  
  Format your response as a JSON array of ad objects with properties: headlines (array of 3 strings) and descriptions (array of 2 strings).`;
  
  if (mindTrigger) {
    const triggerPrompts = {
      urgency: "Create a sense of urgency with deadline-focused language, limited-time offers, or emphasizing what the user might miss. Use phrases like 'Limited Time', 'Act Now', or 'Don't Miss Out'.",
      authority: "Position the brand as an authority or expert in their field. Mention credentials, experience, awards, or industry recognition to build trust.",
      curiosity: "Spark curiosity by hinting at valuable information or solutions without fully revealing them. Use intriguing questions or statements that make users want to learn more.",
      social_proof: "Leverage the power of social validation by mentioning customer counts, reviews, testimonials, or popularity metrics.",
      scarcity: "Emphasize limited availability, exclusivity, or high demand to create a fear of missing out. Use phrases like 'Limited Stock', 'Few Spots Left', or 'While Supplies Last'.",
      exclusivity: "Make the audience feel special by offering exclusive access, membership, or benefits that aren't available to everyone.",
      emotion: "Connect on an emotional level by addressing pain points, aspirations, or desires directly. Use emotionally charged language that resonates with the target audience.",
      novelty: "Highlight what's new, innovative, or different about the offering. Focus on unique aspects that competitors don't have.",
      user_generated: "Create ads that feel like authentic user testimonials or reviews. Use a conversational, first-person perspective that sounds like a real customer.",
      credibility: "Establish trust through facts, statistics, certifications, or guarantees that prove the brand's reliability and effectiveness.",
      value: "Focus on exceptional value, ROI, or the benefits versus cost. Highlight savings, efficiency, or long-term benefits.",
      discount: "Emphasize special pricing, discounts, or promotional offers available now. Use specific numbers and percentages when possible."
    };

    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. ${(triggerPrompts as any)[mindTrigger] || "Focus on creating copy that triggers this specific psychological response in the audience."} Integrate this trigger naturally into each ad.`;
  }
  
  return basePrompt;
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `Create 3 high-converting Instagram/Meta ads for ${campaignData.companyName}. 
  
  The business is: ${campaignData.businessDescription}
  
  Target audience: ${campaignData.targetAudience}
  
  Key selling points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints}
  
  Brand tone: ${campaignData.brandTone}
  
  IMPORTANT INSTRUCTIONS:
  - Write in a social media friendly, conversational tone
  - Create visually descriptive image prompts for appealing Instagram photos
  - Include relevant, trending hashtags - limit to max 3 hashtags
  - Keep text conversational and authentic
  - Incorporate emojis naturally where appropriate for Instagram
  - Make content relatable and shareable
  - Output in the EXACT language as the business description provided
  - Focus on creating content that would stand out in Instagram feeds
  
  Each ad should include:
  - A headline (max 40 characters)
  - Primary text (main post content, 1-2 paragraphs)
  - A description (max 30 characters)
  - An image prompt that would generate a relevant, eye-catching image for Instagram
  - Format (string, always use "square")
  - Hashtags (array of 3 relevant hashtags without # symbol)
  
  Format your response as a JSON array of ad objects with properties: headline, primaryText, description, imagePrompt, format, and hashtags.`;
  
  if (mindTrigger) {
    const triggerPrompts = {
      urgency: "Create a sense of urgency with deadline-focused language, limited-time offers, or emphasizing what the user might miss. Use phrases like 'Limited Time', 'Act Now', or 'Don't Miss Out'.",
      authority: "Position the brand as an authority or expert in their field. Mention credentials, experience, awards, or industry recognition to build trust.",
      curiosity: "Spark curiosity by hinting at valuable information or solutions without fully revealing them. Use intriguing questions or statements that make users want to learn more.",
      social_proof: "Leverage the power of social validation by mentioning customer counts, reviews, testimonials, or popularity metrics.",
      scarcity: "Emphasize limited availability, exclusivity, or high demand to create a fear of missing out. Use phrases like 'Limited Stock', 'Few Spots Left', or 'While Supplies Last'.",
      exclusivity: "Make the audience feel special by offering exclusive access, membership, or benefits that aren't available to everyone.",
      emotion: "Connect on an emotional level by addressing pain points, aspirations, or desires directly. Use emotionally charged language that resonates with the target audience.",
      novelty: "Highlight what's new, innovative, or different about the offering. Focus on unique aspects that competitors don't have.",
      user_generated: "Create ads that feel like authentic user testimonials or reviews. Use a conversational, first-person perspective that sounds like a real customer.",
      credibility: "Establish trust through facts, statistics, certifications, or guarantees that prove the brand's reliability and effectiveness.",
      value: "Focus on exceptional value, ROI, or the benefits versus cost. Highlight savings, efficiency, or long-term benefits.",
      discount: "Emphasize special pricing, discounts, or promotional offers available now. Use specific numbers and percentages when possible."
    };

    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. ${(triggerPrompts as any)[mindTrigger] || "Focus on creating copy that triggers this specific psychological response in the audience."} Integrate this trigger naturally into each ad while maintaining an Instagram-appropriate tone.`;
  }
  
  return basePrompt;
}
