
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
    
    // Look for array directly
    const arrayMatch = jsonContent.match(/\[\s*{[\s\S]*}\s*\]/);
    if (arrayMatch) {
      jsonContent = arrayMatch[0];
    }
    
    // Try to find a JSON object if no array was found
    if (!arrayMatch) {
      const jsonStart = jsonContent.indexOf('[');
      const jsonEnd = jsonContent.lastIndexOf(']') + 1;
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd);
      } else {
        // Look for object format
        const objStart = jsonContent.indexOf('{');
        const objEnd = jsonContent.lastIndexOf('}') + 1;
        
        if (objStart !== -1 && objEnd > objStart) {
          jsonContent = jsonContent.substring(objStart, objEnd);
        }
      }
    }
    
    // Parse the JSON content
    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (error) {
      console.error(`Error parsing JSON for ${platform} ads:`, error);
      throw new Error(`Invalid JSON format in response for ${platform} ads`);
    }
    
    // Handle different response formats
    let ads;
    
    // Check if it's an array directly
    if (Array.isArray(parsedData)) {
      ads = parsedData;
    } 
    // Check if it has an ads array
    else if (parsedData.ads && Array.isArray(parsedData.ads)) {
      ads = parsedData.ads;
    }
    // Check platform-specific arrays in the response
    else if (platform === 'google' && parsedData.google_ads) {
      ads = parsedData.google_ads;
    }
    else if (platform === 'linkedin' && parsedData.linkedin_ads) {
      ads = parsedData.linkedin_ads;
    }
    else if (platform === 'microsoft' && parsedData.bing_ads) {
      ads = parsedData.bing_ads;
    }
    else if (platform === 'meta' && parsedData.meta_ads) {
      ads = parsedData.meta_ads;
    }
    // If we have a single ad object
    else if (!Array.isArray(parsedData) && typeof parsedData === 'object') {
      ads = [parsedData];
    }
    else {
      console.error(`Unexpected response format for ${platform} ads:`, parsedData);
      throw new Error(`Unable to extract ads from response for ${platform}`);
    }
    
    if (!ads || ads.length === 0) {
      console.error(`No ads found in response for ${platform}`);
      throw new Error(`No ads found in response for ${platform}`);
    }
    
    console.log(`Successfully parsed ${ads.length} ${platform} ads`);
    return ads;
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
