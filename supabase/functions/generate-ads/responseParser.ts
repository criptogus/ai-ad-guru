
import { WebsiteAnalysisResult } from "./types.ts";
import { generateFallbackGoogleAds } from "./fallbacks/googleAdsFallbacks.ts";
import { generateFallbackLinkedInAds } from "./fallbacks/linkedInAdsFallbacks.ts";
import { generateFallbackMicrosoftAds } from "./fallbacks/microsoftAdsFallbacks.ts";
import { generateFallbackMetaAds } from "./fallbacks/metaAdsFallbacks.ts";

/**
 * Parses the OpenAI response for different ad platforms
 */
export function parseAdResponse(response: string, platform: string, campaignData: WebsiteAnalysisResult) {
  try {
    // Extract JSON from the response (handles cases where OpenAI wraps JSON in markdown code blocks)
    const jsonStart = response.indexOf('{');
    const jsonEnd = response.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("Invalid response format - no JSON object found");
      throw new Error("Invalid response format");
    }
    
    let jsonString = response.substring(jsonStart, jsonEnd);
    
    // Log the extracted JSON string for debugging
    console.log(`Parsing ${platform} ad response from OpenAI`);
    
    // Parse the JSON
    const data = JSON.parse(jsonString);
    
    // Validate the structure based on platform
    if (data && (data.ads || data.ad)) {
      const ads = data.ads || [data.ad];
      console.log(`Successfully parsed ${platform} ad data:`, JSON.stringify(data, null, 2));
      return ads;
    } else {
      console.error(`Invalid ${platform} ad structure:`, data);
      throw new Error(`Generated ${platform} ads have invalid structure`);
    }
  } catch (error) {
    console.error(`Error parsing ${platform} ad response:`, error);
    
    // Return fallback ads when parsing fails
    if (platform === 'google') {
      return generateFallbackGoogleAds(campaignData);
    } else if (platform === 'linkedin') {
      return generateFallbackLinkedInAds(campaignData);
    } else if (platform === 'microsoft') {
      return generateFallbackMicrosoftAds(campaignData);
    } else if (platform === 'meta') {
      return generateFallbackMetaAds(campaignData);
    }
    
    return [];
  }
}

// Export all the fallback generators for direct use
export { 
  generateFallbackGoogleAds, 
  generateFallbackLinkedInAds,
  generateFallbackMicrosoftAds,
  generateFallbackMetaAds 
};
