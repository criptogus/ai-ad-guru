
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
    
    console.log("🧠 OpenAI Request Configuration:");
    console.log("System message:", enhancedSystemMessage);
    console.log("User message:", userMessage);

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

    console.log("🔄 Raw OpenAI response content:", content);

    try {
      // Try to extract a JSON array from the response
      let parsedContent;
      
      // First, try to parse as direct JSON
      try {
        parsedContent = JSON.parse(content);
        console.log("✅ Parsed OpenAI response as direct JSON");
      } catch (parseError) {
        // If direct parse fails, try to extract JSON from text
        console.log("⚠️ Direct parse failed, attempting to extract JSON from text");
        const jsonMatch = content.match(/\[\s*{(.|\n)*}\s*\]/);
        if (jsonMatch) {
          parsedContent = JSON.parse(jsonMatch[0]);
          console.log("✅ Extracted JSON from text content");
        } else {
          console.error("❌ Could not extract valid JSON from the response");
          throw new Error("Could not extract valid JSON from the response");
        }
      }
      
      // Handle either array or object with ads array inside
      let finalAds;
      if (Array.isArray(parsedContent)) {
        console.log("📊 Response is a direct array with", parsedContent.length, "ads");
        finalAds = parsedContent;
      } else if (parsedContent && Array.isArray(parsedContent.ads)) {
        console.log("📊 Response contains 'ads' array with", parsedContent.ads.length, "ads");
        finalAds = parsedContent.ads;
      } else if (parsedContent && Array.isArray(parsedContent.data)) {
        console.log("📊 Response contains 'data' array with", parsedContent.data.length, "ads");
        finalAds = parsedContent.data;
      } else {
        console.error("❌ Unexpected format from OpenAI:", parsedContent);
        throw new Error("Unexpected format from OpenAI");
      }
      
      console.log("🎯 Final ads extracted:", JSON.stringify(finalAds, null, 2));
      return finalAds;
    } catch (error) {
      console.error("❌ Error parsing OpenAI response:", error);
      console.error("❌ Raw content:", content);
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }
  } catch (error) {
    console.error("❌ OpenAI API error:", error);
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

// Common function to handle errors and fallbacks
function handleGenerationError(error: Error, platform: string): never {
  console.error(`❌ Error generating ${platform} ads:`, error);
  throw new Error(`Failed to generate ${platform} ads: ${error.message}`);
}

// Google Ads Generator
export async function generateGoogleAds(
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string,
  additionalInstructions?: string
): Promise<any[]> {
  try {
    console.log("📝 Creating Google Ads prompt with campaign data");
    const { systemMessage, userMessage } = createGoogleAdsPrompt(campaignData, mindTrigger);
    console.log("🚀 Calling OpenAI to generate Google Ads");
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    console.log("✅ Google Ads generated, sanitizing results");
    const sanitizedAds = sanitizeGoogleAds(adsData, campaignData);
    console.log("🎯 Final sanitized Google Ads:", JSON.stringify(sanitizedAds, null, 2));
    return sanitizedAds;
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
    console.log("📝 Creating Meta Ads prompt with campaign data");
    const { systemMessage, userMessage } = createMetaAdsPrompt(campaignData, mindTrigger);
    console.log("🚀 Calling OpenAI to generate Meta Ads");
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    console.log("✅ Meta Ads generated, sanitizing results");
    const sanitizedAds = sanitizeMetaAds(adsData, campaignData);
    console.log("🎯 Final sanitized Meta Ads:", JSON.stringify(sanitizedAds, null, 2));
    return sanitizedAds;
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
    console.log("📝 Creating LinkedIn Ads prompt with campaign data");
    const { systemMessage, userMessage } = createLinkedInAdsPrompt(campaignData, mindTrigger);
    console.log("🚀 Calling OpenAI to generate LinkedIn Ads");
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    console.log("✅ LinkedIn Ads generated, sanitizing results");
    const sanitizedAds = sanitizeLinkedInAds(adsData, campaignData);
    console.log("🎯 Final sanitized LinkedIn Ads:", JSON.stringify(sanitizedAds, null, 2));
    return sanitizedAds;
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
    console.log("📝 Creating Microsoft Ads prompt with campaign data");
    const { systemMessage, userMessage } = createMicrosoftAdsPrompt(campaignData, mindTrigger);
    console.log("🚀 Calling OpenAI to generate Microsoft Ads");
    const adsData = await generateAdsWithOpenAI(systemMessage, userMessage, additionalInstructions);
    console.log("✅ Microsoft Ads generated, sanitizing results");
    const sanitizedAds = sanitizeMicrosoftAds(adsData, campaignData);
    console.log("🎯 Final sanitized Microsoft Ads:", JSON.stringify(sanitizedAds, null, 2));
    return sanitizedAds;
  } catch (error) {
    return handleGenerationError(error, "Microsoft");
  }
}

type PromptMessages = {
  systemMessage: string;
  userMessage: string;
};
