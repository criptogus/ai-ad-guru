
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
  
  Format your response as a JSON array of ad objects with properties: headlines (array of 3 strings) and descriptions (array of 2 strings).`;
  
  if (mindTrigger) {
    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. Focus on creating copy that triggers this specific psychological response in the audience.`;
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
  
  Each ad should include:
  - A headline (max 50 characters)
  - Primary text (main post content, 1-2 paragraphs)
  - A description (max 70 characters)
  - An image prompt that would generate a relevant image for the ad
  - Format (string, always use "single-image")
  - Hashtags (array of 3 relevant hashtags without # symbol)
  
  Format your response as a JSON array of ad objects with properties: headline, primaryText, description, imagePrompt, format, and hashtags.`;
  
  if (mindTrigger) {
    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. Focus on creating copy that triggers this specific psychological response in the audience.`;
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
  
  Each ad should include:
  - 3 headlines (max 30 characters each)
  - 2 descriptions (max 90 characters each)
  
  Format your response as a JSON array of ad objects with properties: headlines (array of 3 strings) and descriptions (array of 2 strings).`;
  
  if (mindTrigger) {
    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. Focus on creating copy that triggers this specific psychological response in the audience.`;
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
  
  Each ad should include:
  - A headline (max 40 characters)
  - Primary text (main post content, 1-2 paragraphs)
  - A description (max 30 characters)
  - An image prompt that would generate a relevant image for the ad
  - Format (string, always use "square")
  - Hashtags (array of 3 relevant hashtags without # symbol)
  
  Format your response as a JSON array of ad objects with properties: headline, primaryText, description, imagePrompt, format, and hashtags.`;
  
  if (mindTrigger) {
    return `${basePrompt}\n\nIMPORTANT: Apply the psychological trigger "${mindTrigger}" to make these ads more persuasive and compelling. Focus on creating copy that triggers this specific psychological response in the audience.`;
  }
  
  return basePrompt;
}
