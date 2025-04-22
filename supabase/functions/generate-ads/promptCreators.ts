
import { WebsiteAnalysisResult } from "./types.ts";

export function createGoogleAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const { 
    companyName = "", 
    businessDescription = "", 
    targetAudience = "", 
    keywords = [], 
    uniqueSellingPoints = [] 
  } = campaignData;
  
  let promptBuilder = `Generate 5 Google Search Ads for ${companyName}.`;
  promptBuilder += `\n\nBusiness Description: ${businessDescription}`;
  
  if (targetAudience) {
    promptBuilder += `\n\nTarget Audience: ${targetAudience}`;
  }
  
  if (keywords && keywords.length > 0) {
    promptBuilder += `\n\nKeywords: ${Array.isArray(keywords) ? keywords.join(", ") : keywords}`;
  }
  
  if (uniqueSellingPoints && uniqueSellingPoints.length > 0) {
    promptBuilder += `\n\nUnique Selling Points: ${Array.isArray(uniqueSellingPoints) ? uniqueSellingPoints.join(", ") : uniqueSellingPoints}`;
  }
  
  if (mindTrigger) {
    promptBuilder += `\n\nUse the ${mindTrigger} psychological trigger in the ad copy.`;
  }
  
  promptBuilder += `\n\nRespond with a JSON array of ad objects with these fields: headline_1, headline_2, headline_3, description_1, description_2`;
  
  return promptBuilder;
}

export function createLinkedInAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const { 
    companyName = "", 
    businessDescription = "", 
    targetAudience = "", 
    keywords = [] 
  } = campaignData;
  
  let promptBuilder = `Generate 5 LinkedIn Ads for ${companyName}.`;
  promptBuilder += `\n\nBusiness Description: ${businessDescription}`;
  
  if (targetAudience) {
    promptBuilder += `\n\nTarget Audience: ${targetAudience}`;
  }
  
  if (keywords && keywords.length > 0) {
    promptBuilder += `\n\nKeywords: ${Array.isArray(keywords) ? keywords.join(", ") : keywords}`;
  }
  
  if (mindTrigger) {
    promptBuilder += `\n\nUse the ${mindTrigger} psychological trigger in the ad copy.`;
  }
  
  promptBuilder += `\n\nFor each ad, create a professional headline, primary text, and an image prompt for a compelling ad visual.`;
  promptBuilder += `\n\nRespond with a JSON array of ad objects with these fields: text, image_prompt`;
  
  return promptBuilder;
}

export function createMicrosoftAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const { 
    companyName = "", 
    businessDescription = "", 
    targetAudience = "", 
    keywords = [] 
  } = campaignData;
  
  let promptBuilder = `Generate 5 Microsoft Bing Ads for ${companyName}.`;
  promptBuilder += `\n\nBusiness Description: ${businessDescription}`;
  
  if (targetAudience) {
    promptBuilder += `\n\nTarget Audience: ${targetAudience}`;
  }
  
  if (keywords && keywords.length > 0) {
    promptBuilder += `\n\nKeywords: ${Array.isArray(keywords) ? keywords.join(", ") : keywords}`;
  }
  
  if (mindTrigger) {
    promptBuilder += `\n\nUse the ${mindTrigger} psychological trigger in the ad copy.`;
  }
  
  promptBuilder += `\n\nRespond with a JSON array of ad objects with these fields: headline_1, headline_2, description, display_url`;
  
  return promptBuilder;
}

export function createMetaAdsPrompt(campaignData: WebsiteAnalysisResult, mindTrigger?: string): string {
  const { 
    companyName = "", 
    businessDescription = "", 
    targetAudience = "", 
    keywords = [] 
  } = campaignData;
  
  let promptBuilder = `Generate 5 Instagram/Meta Ads for ${companyName}.`;
  promptBuilder += `\n\nBusiness Description: ${businessDescription}`;
  
  if (targetAudience) {
    promptBuilder += `\n\nTarget Audience: ${targetAudience}`;
  }
  
  if (keywords && keywords.length > 0) {
    promptBuilder += `\n\nKeywords: ${Array.isArray(keywords) ? keywords.join(", ") : keywords}`;
  }
  
  if (mindTrigger) {
    promptBuilder += `\n\nUse the ${mindTrigger} psychological trigger in the ad copy.`;
  }
  
  promptBuilder += `\n\nFor each ad, create engaging captions with hashtags and an image prompt for a high-quality visual.`;
  promptBuilder += `\n\nRespond with a JSON array of ad objects with these fields: text, image_prompt`;
  
  return promptBuilder;
}
