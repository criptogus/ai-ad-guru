
import { GoogleAd, MetaAd } from "./types.ts";
import { WebsiteAnalysisResult } from "./types.ts";
import { 
  detectLanguagesInAdContent, 
  isEnglishText, 
  isPortugueseText, 
  isSpanishText 
} from "./utils/languageDetection.ts";
import { 
  generateFallbackGoogleAds, 
  fixLanguageConsistency 
} from "./fallbacks/googleAdsFallbacks.ts";
import { 
  generateFallbackMetaAds 
} from "./fallbacks/metaAdsFallbacks.ts";

// Export fallback generation functions for external use
export { generateFallbackGoogleAds, generateFallbackMetaAds };

/**
 * Parses OpenAI response into properly formatted ads
 */
export const parseAdResponse = (generatedContent: string, platform: string, campaignData: WebsiteAnalysisResult) => {
  console.log(`OpenAI response for ${platform} ads:`, generatedContent);
  
  try {
    // Find JSON in the response
    const jsonMatch = generatedContent.match(/\[\s*{[\s\S]*}\s*\]/);
    let adData;
    
    if (jsonMatch) {
      adData = JSON.parse(jsonMatch[0]);
    } else {
      // If not found, try to parse the entire response as JSON
      try {
        adData = JSON.parse(generatedContent);
      } catch (error) {
        console.error(`Failed to parse OpenAI response as JSON for ${platform} ads:`, error.message);
        throw new Error('Invalid response format');
      }
    }
    
    // Handle both array and non-array responses
    if (!Array.isArray(adData)) {
      // If the response is not an array, check if it contains an array property
      const possibleArrayProperties = Object.values(adData).filter(value => Array.isArray(value));
      if (possibleArrayProperties.length > 0) {
        // Use the first array found
        adData = possibleArrayProperties[0];
      } else {
        console.error(`No array found in response for ${platform} ads:`, adData);
        throw new Error('No ad array found in response');
      }
    }
    
    // Validate and fix the ad content
    if (platform === 'google' && Array.isArray(adData)) {
      adData = adData.map((ad, index) => {
        // Store original headlines and descriptions for language analysis
        const origHeadlines = [...ad.headlines];
        const origDescriptions = [...ad.descriptions];
        
        // Check for language consistency in the ad
        const detectedLanguages = detectLanguagesInAdContent(ad);
        console.log(`Ad ${index + 1} detected languages:`, detectedLanguages);
        
        if (detectedLanguages.mixed) {
          console.log(`Mixed languages detected in ad ${index + 1}, attempting to fix`);
          ad = fixLanguageConsistency(ad, campaignData);
        }
        
        // Ensure at least one headline contains the company name
        const companyNameLower = campaignData.companyName.toLowerCase();
        const hasCompanyName = ad.headlines.some(headline => 
          headline.toLowerCase().includes(companyNameLower)
        );
        
        if (!hasCompanyName && ad.headlines.length > 0) {
          // Replace first headline with company name if missing
          ad.headlines[0] = campaignData.companyName;
        }
        
        // Log the changes made for debugging
        if (ad.headlines.some((h, i) => h !== origHeadlines[i]) || 
            ad.descriptions.some((d, i) => d !== origDescriptions[i])) {
          console.log(`Fixed ad ${index + 1}:`, {
            before: { headlines: origHeadlines, descriptions: origDescriptions },
            after: { headlines: ad.headlines, descriptions: ad.descriptions }
          });
        }
        
        return ad;
      });
    }
    
    // Final check to ensure we have desired number of ad variations
    if (!Array.isArray(adData) || adData.length === 0) {
      console.error(`Invalid ${platform} ad format received:`, adData);
      
      // Generate fallback ad variations if the response was invalid
      if (platform === 'google') {
        adData = generateFallbackGoogleAds(campaignData);
      } else if (platform === 'meta') {
        adData = generateFallbackMetaAds(campaignData);
      }
    } else if (platform === 'google' && adData.length < 5) {
      // Ensure we have at least 5 Google ad variations
      console.log(`Only ${adData.length} Google ad variations received, generating additional fallbacks`);
      const fallbacks = generateFallbackGoogleAds(campaignData);
      adData = [...adData, ...fallbacks.slice(0, 5 - adData.length)];
    } else if (platform === 'meta' && adData.length < 3) {
      // Ensure we have at least 3 Meta ad variations
      console.log(`Only ${adData.length} Meta ad variations received, generating additional fallbacks`);
      const fallbacks = generateFallbackMetaAds(campaignData);
      adData = [...adData, ...fallbacks.slice(0, 3 - adData.length)];
    }
    
    return adData;
  } catch (error) {
    console.error(`Failed to parse OpenAI response for ${platform} ads:`, error.message);
    
    // Return fallback ads on any parsing error
    if (platform === 'google') {
      return generateFallbackGoogleAds(campaignData);
    } else if (platform === 'meta') {
      return generateFallbackMetaAds(campaignData);
    } else {
      return [];
    }
  }
};
