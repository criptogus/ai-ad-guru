
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
    console.log(`Parsing raw response for ${platform} ads`);
    
    // Extract JSON from the response (handles cases where OpenAI wraps JSON in markdown code blocks)
    let jsonContent = response;
    
    // Try to extract JSON if it's wrapped in code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Try to parse the JSON content
    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (error) {
      console.error(`Error parsing JSON for ${platform} ads:`, error);
      throw new Error(`Invalid JSON format in response for ${platform} ads`);
    }
    
    // Handle different response formats based on platform
    let ads;
    
    if (platform === 'google') {
      ads = parsedData.google_ads || [];
    }
    else if (platform === 'linkedin') {
      ads = parsedData.linkedin_ads || [];
    }
    else if (platform === 'microsoft') {
      ads = parsedData.bing_ads || parsedData.microsoft_ads || [];
    }
    else if (platform === 'meta') {
      ads = parsedData.meta_ads || parsedData.instagram_ads || [];
    }
    
    // If we didn't find platform-specific ads, try a general "ads" array
    if (!ads || ads.length === 0) {
      ads = parsedData.ads || [];
    }
    
    // If ads is still empty, check if the response is a direct array
    if ((!ads || ads.length === 0) && Array.isArray(parsedData)) {
      ads = parsedData;
    }
    
    // If ads is still empty, check if the response is a single ad object
    if ((!ads || ads.length === 0) && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
      // Look for ad-specific properties to confirm this is an ad object
      const hasAdProperties = platform === 'google' 
        ? (parsedData.headlines || parsedData.descriptions)
        : (platform === 'meta' || platform === 'linkedin' 
          ? (parsedData.headline || parsedData.primaryText) 
          : false);
      
      if (hasAdProperties) {
        ads = [parsedData];
      }
    }
    
    if (!ads || ads.length === 0) {
      console.error(`No ads found in response for ${platform}`);
      throw new Error(`No ads found in response for ${platform}`);
    }
    
    console.log(`Successfully parsed ${ads.length} ${platform} ads`);
    return ads;
  } catch (error) {
    console.error(`Error parsing ${platform} ad response:`, error);
    console.log("Falling back to default ad templates");
    
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
