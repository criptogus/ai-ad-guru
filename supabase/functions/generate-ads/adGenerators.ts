
import { WebsiteAnalysisResult } from "./types.ts";
import { getOpenAIClient } from "./openai.ts";
import { createGoogleAdsPrompt, createMetaAdsPrompt, createLinkedInAdsPrompt, createMicrosoftAdsPrompt } from "./promptCreators.ts";
import { sanitizeGoogleAds, sanitizeMetaAds, sanitizeLinkedInAds, sanitizeMicrosoftAds } from "./responseValidators.ts";

// Common function to generate ads using OpenAI across all platforms
async function generateAdsWithOpenAI(
  systemMessage: string,
  userMessage: string,
  additionalInstructions?: string
): Promise<any[]> {
  try {
    const openai = getOpenAIClient();
    
    // Add additional forcing instructions to the system message
    const enhancedSystemMessage = additionalInstructions 
      ? `${systemMessage}\n\n${additionalInstructions}` 
      : systemMessage;
    
    console.log("Using system message:", enhancedSystemMessage.substring(0, 100) + "...");
    console.log("Using user message:", userMessage.substring(0, 100) + "...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using GPT-4o mini consistently across all platforms
      messages: [
        { role: "system", content: enhancedSystemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.2, // Consistent low temperature for predictable responses
      max_tokens: 2500,
      top_p: 0.95,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      response_format: { type: "json_object" } // Force JSON response format
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No content returned from OpenAI");

    try {
      // Try to extract a JSON array from the response
      let parsedContent;
      
      // First, try to parse as direct JSON
      try {
        parsedContent = JSON.parse(content);
      } catch (parseError) {
        // If direct parse fails, try to extract JSON from text
        const jsonMatch = content.match(/\[\s*{(.|\n)*}\s*\]/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not extract valid JSON from the response");
        }
      }
      
      // Handle either array or object with ads array inside
      if (Array.isArray(parsedContent)) {
        return parsedContent;
      } else if (parsedContent && Array.isArray(parsedContent.ads)) {
        return parsedContent.ads;
      } else if (parsedContent && Array.isArray(parsedContent.data)) {
        return parsedContent.data;
      } else {
        console.error("Unexpected format from OpenAI:", parsedContent);
        throw new Error("Unexpected format from OpenAI");
      }
    } catch (error) {
      console.error("Error parsing OpenAI response:", error);
      console.error("Raw content:", content);
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Common function to handle errors and fallbacks
function handleGenerationError(error: Error, platform: string): never {
  console.error(`Error generating ${platform} ads:`, error);
  throw new Error(`Failed to generate ${platform} ads: ${error.message}`);
}

// Google Ads Generator
export async function generateGoogleAds(
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string,
  additionalInstructions?: string
): Promise<any[]> {
  try {
    const { systemMessage, userMessage } = createGoogleAdsPrompt(campaignData, mindTrigger);
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    return sanitizeGoogleAds(adsData, campaignData);
  } catch (error) {
    return handleGenerationError(error, "Google");
  }
}

// Meta Ads Generator
export async function generateMetaAds(
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string,
  additionalInstructions?: string
): Promise<any[]> {
  try {
    const { systemMessage, userMessage } = createMetaAdsPrompt(campaignData, mindTrigger);
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    return sanitizeMetaAds(adsData, campaignData);
  } catch (error) {
    return handleGenerationError(error, "Meta");
  }
}

// LinkedIn Ads Generator
export async function generateLinkedInAds(
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string,
  additionalInstructions?: string
): Promise<any[]> {
  try {
    const { systemMessage, userMessage } = createLinkedInAdsPrompt(campaignData, mindTrigger);
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    return sanitizeLinkedInAds(adsData, campaignData);
  } catch (error) {
    return handleGenerationError(error, "LinkedIn");
  }
}

// Microsoft Ads Generator
export async function generateMicrosoftAds(
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string,
  additionalInstructions?: string
): Promise<any[]> {
  try {
    const { systemMessage, userMessage } = createMicrosoftAdsPrompt(campaignData, mindTrigger);
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    return sanitizeMicrosoftAds(adsData, campaignData);
  } catch (error) {
    return handleGenerationError(error, "Microsoft");
  }
}

type PromptMessages = {
  systemMessage: string;
  userMessage: string;
};
