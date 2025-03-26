
import { WebsiteAnalysisResult } from "./types.ts";
import { 
  generateFallbackGoogleAds,
  generateFallbackLinkedInAds,
  generateFallbackMicrosoftAds,
  generateFallbackMetaAds
} from "./fallbacks/index.ts";

export function parseAdResponse(response: string, platform: string, campaignData: WebsiteAnalysisResult) {
  console.log(`Parsing ${platform} response`);
  
  try {
    // Try to parse the response as JSON directly
    try {
      const directJson = JSON.parse(response);
      if (Array.isArray(directJson)) {
        console.log(`Successfully parsed ${platform} response as direct JSON array`);
        return directJson;
      } else if (directJson.ads && Array.isArray(directJson.ads)) {
        console.log(`Successfully parsed ${platform} response with ads property`);
        return directJson.ads;
      }
    } catch (error) {
      // If direct JSON parsing fails, continue with string processing
      console.log(`Response is not direct JSON, attempting to extract JSON from text`);
    }
    
    // Look for JSON block in the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                     response.match(/```\s*([\s\S]*?)\s*```/) || 
                     response.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      console.log(`Found JSON block in response: ${jsonStr.substring(0, 100)}...`);
      
      try {
        const parsedData = JSON.parse(jsonStr);
        
        if (Array.isArray(parsedData)) {
          console.log(`Successfully parsed ${platform} JSON block as array`);
          return parsedData;
        } else if (parsedData.ads && Array.isArray(parsedData.ads)) {
          console.log(`Successfully parsed ${platform} JSON block with ads property`);
          return parsedData.ads;
        } else {
          console.error(`${platform} JSON block doesn't contain expected format`);
          // Use fallbacks
          return getFallbackAds(platform, campaignData);
        }
      } catch (error) {
        console.error(`Error parsing JSON block: ${error}`);
        return getFallbackAds(platform, campaignData);
      }
    } else {
      console.error(`No JSON block found in ${platform} response`);
      return getFallbackAds(platform, campaignData);
    }
  } catch (error) {
    console.error(`Error parsing ${platform} ad response:`, error);
    return getFallbackAds(platform, campaignData);
  }
}

function getFallbackAds(platform: string, campaignData: WebsiteAnalysisResult) {
  console.log(`Using fallback ${platform} ads`);
  
  switch(platform) {
    case 'google':
      return generateFallbackGoogleAds(campaignData);
    case 'linkedin':
      return generateFallbackLinkedInAds(campaignData);
    case 'microsoft':
      return generateFallbackMicrosoftAds(campaignData);
    case 'meta':
      return generateFallbackMetaAds(campaignData);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

export { 
  generateFallbackGoogleAds,
  generateFallbackLinkedInAds,
  generateFallbackMicrosoftAds,
  generateFallbackMetaAds
};
