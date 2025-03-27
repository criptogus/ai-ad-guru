
import { WebsiteAnalysisResult } from "./types.ts";

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `You are an expert digital advertising copywriter and strategist with deep knowledge of PPC and search ad optimization. Using the provided brand and campaign data, create 5 compelling Google Ad variations that drive clicks and conversions.

  ### Input Context  
  - Company Name: ${campaignData.companyName || 'Your Company'}
  - Company Description: ${campaignData.businessDescription || 'Your Business'}
  - Target Audience: ${campaignData.targetAudience || 'General Audience'}
  - Website URL: ${campaignData.websiteUrl || 'example.com'}
  - Industry/Niche: ${campaignData.industry || 'Unknown Industry'}
  - Tone of Voice: ${campaignData.brandTone || 'Professional'}
  - Unique Selling Points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints || 'Your unique advantages'}
  
  ### Platform-Specific Instructions - Google Ads (Search – Text Only)  
  - Objective: Drive clicks with emotional, high-intent copy
  - Format:  
    - Headlines: array of 3 strings (each 30 chars max)
    - Descriptions: array of 2 strings (each 90 chars max)
  
  ### Proven Google Ads Hacks:  
  - Use questions or bold claims (e.g., "Struggling to Grow?")
  - Include competitor-inspired keywords subtly
  - Add urgency (e.g., "Act Now", "Limited Spots")
  - Optimize for mobile with short, punchy CTAs (e.g., "Tap to Save")
  - Highlight benefits (e.g., "10x ROI") over features
  - Test emotional hooks aligned with the target audience
  
  ### Additional Guidelines:
  - Ensure each ad variation is unique and tests different approaches
  - Follow exact character limits for each field
  - Create mobile-friendly, clickable headlines
  - Focus on driving immediate action
  - Avoid generic phrases unless they're proven to work for the industry
  - Incorporate the call-to-action seamlessly
  
  Return response as a JSON array containing 5 ad objects. Each ad should have:
  - headlines: an array of 3 strings (each 30 chars max)
  - descriptions: an array of 2 strings (each 90 chars max)`;
  
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

    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. ${(triggerPrompts as any)[mindTrigger] || "Focus on creating copy that triggers this specific psychological response in the audience."} Integrate this trigger naturally into each ad to maximize clicks and conversions.`;
  }
  
  return basePrompt;
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `You are an expert digital advertising copywriter and strategist with deep knowledge of B2B and LinkedIn ad optimization. Using the provided brand and campaign data, create 5 compelling LinkedIn Ad variations that engage B2B professionals with authority and value.

  ### Input Context  
  - Company Name: ${campaignData.companyName || 'Your Company'}
  - Company Description: ${campaignData.businessDescription || 'Your Business'}
  - Target Audience: ${campaignData.targetAudience || 'B2B Professionals'}
  - Website URL: ${campaignData.websiteUrl || 'example.com'}
  - Industry/Niche: ${campaignData.industry || 'Unknown Industry'}
  - Tone of Voice: ${campaignData.brandTone || 'Professional'}
  - Unique Selling Points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints || 'Your unique advantages'}
  
  ### Platform-Specific Instructions - LinkedIn Ads (Image + Text) 
  - Objective: Engage B2B professionals with authority and value
  - Format:  
    - Headline (max 50 characters)
    - Primary text (main post content, 1-2 paragraphs)
    - Description (max 70 characters, serves as CTA)
    - Image prompt (detailed description for generating a relevant professional image)
  
  ### Proven LinkedIn Ads Hacks:  
  - Start with a stat or success hook (e.g., "80% Boost in Leads")
  - Use professional visuals that convey authority and expertise
  - Target niche professional interests
  - Keep tone professional but conversational
  - Use clear value propositions relevant to business goals
  - Suggest business-appropriate image concepts
  
  ### Additional Guidelines:
  - Write in a professional, business-focused tone
  - Focus on career advancement, professional development, or business growth
  - Be specific about professional benefits and outcomes
  - Include relevant industry terminology where appropriate
  - Craft ads that would appeal to business decision-makers
  - Include 3 relevant, professional hashtags
  
  Return response as a JSON array containing 5 ad objects. Each ad should have:
  - headline: string (max 50 characters)
  - primaryText: string (main post content)
  - description: string (max 70 characters)
  - imagePrompt: string (detailed prompt for generating a relevant professional image)
  - hashtags: array of 3 strings (relevant hashtags without # symbol)`;
  
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
  const basePrompt = `You are an expert digital advertising copywriter and strategist with deep knowledge of PPC and Bing/Microsoft ad optimization. Using the provided brand and campaign data, create 5 compelling Microsoft/Bing Ad variations that attract clicks with formal, value-driven copy.

  ### Input Context  
  - Company Name: ${campaignData.companyName || 'Your Company'}
  - Company Description: ${campaignData.businessDescription || 'Your Business'}
  - Target Audience: ${campaignData.targetAudience || 'General Audience'}
  - Website URL: ${campaignData.websiteUrl || 'example.com'}
  - Industry/Niche: ${campaignData.industry || 'Unknown Industry'}
  - Tone of Voice: ${campaignData.brandTone || 'Professional'}
  - Unique Selling Points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints || 'Your unique advantages'}
  
  ### Platform-Specific Instructions - Microsoft/Bing Ads (Search – Text Only)  
  - Objective: Attract clicks with formal, value-driven copy
  - Format:  
    - Headlines: array of 3 strings (each 30 chars max)
    - Descriptions: array of 2 strings (each 90 chars max)
  
  ### Proven Microsoft/Bing Ads Hacks:  
  - Use trust signals (e.g., "Proven Results", "Since 2010")
  - Focus on value over urgency (e.g., "Save More Today")
  - Optimize for desktop users with formal tone and detailed CTAs
  - Use slightly longer headlines for clarity when possible
  - Emphasize reliability and credibility
  - Differentiate from Google Ads with a Microsoft-friendly style
  
  ### Additional Guidelines:
  - Be concise and impactful - every character counts
  - Focus on benefits, not features
  - Include at least one clear call-to-action
  - Use natural, conversational language
  - Avoid generic phrases unless they're proven to work for the industry
  - Match the brand's tone exactly
  
  Return response as a JSON array containing 5 ad objects. Each ad should have:
  - headlines: an array of 3 strings (each 30 chars max)
  - descriptions: an array of 2 strings (each 90 chars max)`;
  
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

    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. ${(triggerPrompts as any)[mindTrigger] || "Focus on creating copy that triggers this specific psychological response in the audience."} Integrate this trigger naturally into each ad while maintaining an appropriate Microsoft/Bing Ads tone.`;
  }
  
  return basePrompt;
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const basePrompt = `You are an expert digital advertising copywriter and strategist with deep knowledge of social media and Instagram/Meta ad optimization. Using the provided brand and campaign data, create 3 compelling Instagram/Meta Ad variations that stop thumbs with bold visuals and engaging copy.

  ### Input Context  
  - Company Name: ${campaignData.companyName || 'Your Company'}
  - Company Description: ${campaignData.businessDescription || 'Your Business'}
  - Target Audience: ${campaignData.targetAudience || 'Social Media Users'}
  - Website URL: ${campaignData.websiteUrl || 'example.com'}
  - Industry/Niche: ${campaignData.industry || 'Unknown Industry'}
  - Tone of Voice: ${campaignData.brandTone || 'Conversational'}
  - Unique Selling Points: ${Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints.join(", ") 
    : campaignData.uniqueSellingPoints || 'Your unique advantages'}
  
  ### Platform-Specific Instructions - Instagram/Meta Ads (Image + Text)  
  - Objective: Stop thumbs with bold visuals and engaging copy
  - Format:  
    - Headline (max 40 characters)
    - Primary text (120–200 chars preferred, engaging caption)
    - Description (max 30 characters, serves as CTA)
    - Image prompt (detailed description for generating a relevant eye-catching image)
  
  ### Proven Instagram/Meta Ads Hacks:  
  - Hook in first 3 seconds with attention-grabbing opening
  - Use short video-ready visuals with vibrant colors
  - Add 2-3 emojis and 3 niche hashtags
  - Soft-sell first, then clear CTA
  - Create eye-catching, mobile-optimized content
  - Use relatable, conversational language
  
  ### Additional Guidelines:
  - Write in a social media friendly, conversational tone
  - Create visually descriptive image prompts for appealing Instagram photos
  - Include relevant, trending hashtags - limit to max 3 hashtags
  - Keep text conversational and authentic
  - Incorporate emojis naturally where appropriate
  - Make content relatable and shareable
  - Focus on creating content that would stand out in Instagram feeds
  
  Return response as a JSON array containing 3 ad objects. Each ad should have:
  - headline: string (max 40 characters)
  - primaryText: string (main post content, 120-200 chars preferred)
  - description: string (max 30 characters)
  - imagePrompt: string (detailed prompt for generating an eye-catching image)
  - hashtags: array of 3 strings (relevant hashtags without # symbol)`;
  
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
