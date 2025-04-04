
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
    
    // If the response is not valid JSON (like a text response), try to extract structured data
    if (!jsonContent.startsWith('{') && !jsonContent.startsWith('[')) {
      // For Google Ads
      if (platform === 'google') {
        return extractGoogleAdsFromText(response, campaignData);
      }
      // For LinkedIn Ads
      else if (platform === 'linkedin') {
        return extractLinkedInAdsFromText(response, campaignData);
      }
      
      // For other platforms, try the fallback
      console.error(`Could not extract JSON or structured data from ${platform} response`);
      return getFallbackAds(platform, campaignData);
    }
    
    // Try to parse the JSON content
    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch (error) {
      console.error(`Error parsing JSON for ${platform} ads:`, error);
      return getFallbackAds(platform, campaignData);
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
      return getFallbackAds(platform, campaignData);
    }
    
    console.log(`Successfully parsed ${ads.length} ${platform} ads`);
    return ads;
  } catch (error) {
    console.error(`Error parsing ${platform} ad response:`, error);
    console.log("Falling back to default ad templates");
    return getFallbackAds(platform, campaignData);
  }
}

// Helper function to get fallback ads
function getFallbackAds(platform: string, campaignData: WebsiteAnalysisResult) {
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

// Helper function to extract Google Ads from text
function extractGoogleAdsFromText(text: string, campaignData: WebsiteAnalysisResult) {
  try {
    const ads = [];
    const adSections = text.split(/Ad \d+:|Ad Variation \d+:|Google Ad \d+:/i);
    
    // Skip the first element if it's just introductory text
    for (let i = 1; i < adSections.length; i++) {
      const section = adSections[i].trim();
      if (!section) continue;
      
      const headlines = [];
      const descriptions = [];
      
      // Extract headlines
      const headlineMatches = section.matchAll(/Headline \d+:|Title \d+:|H\d+:|Heading \d+:/gi);
      for (const match of headlineMatches) {
        const startIndex = match.index + match[0].length;
        const endIndex = section.indexOf('\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          const headline = section.substring(startIndex, endIndex).trim();
          if (headline) headlines.push(headline);
        }
      }
      
      // If no structured headlines, try to extract them by position
      if (headlines.length === 0) {
        const lines = section.split('\n');
        // Take the first 3 non-empty lines as headlines
        let count = 0;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.toLowerCase().includes('headline') && 
              !trimmed.toLowerCase().includes('description') &&
              !trimmed.toLowerCase().includes('path')) {
            headlines.push(trimmed);
            count++;
            if (count >= 3) break;
          }
        }
      }
      
      // Extract descriptions
      const descriptionMatches = section.matchAll(/Description \d+:|Desc \d+:|D\d+:/gi);
      for (const match of descriptionMatches) {
        const startIndex = match.index + match[0].length;
        const endIndex = section.indexOf('\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          const description = section.substring(startIndex, endIndex).trim();
          if (description) descriptions.push(description);
        }
      }
      
      // If no structured descriptions, try to extract them by position
      if (descriptions.length === 0) {
        const lines = section.split('\n');
        // Skip headers and headlines, then take the next 2 lines as descriptions
        let foundHeadlines = 0;
        let count = 0;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            if (foundHeadlines < headlines.length) {
              if (headlines.includes(trimmed)) foundHeadlines++;
              continue;
            }
            
            if (!trimmed.toLowerCase().includes('headline') && 
                !trimmed.toLowerCase().includes('description') &&
                !trimmed.toLowerCase().includes('path')) {
              descriptions.push(trimmed);
              count++;
              if (count >= 2) break;
            }
          }
        }
      }
      
      // Extract paths (if any)
      let path1 = '';
      let path2 = '';
      
      const path1Match = section.match(/Path 1:|Display Path 1:|Final URL Path 1:|P1:/i);
      if (path1Match) {
        const startIndex = path1Match.index + path1Match[0].length;
        const endIndex = section.indexOf('\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          path1 = section.substring(startIndex, endIndex).trim();
        }
      }
      
      const path2Match = section.match(/Path 2:|Display Path 2:|Final URL Path 2:|P2:/i);
      if (path2Match) {
        const startIndex = path2Match.index + path2Match[0].length;
        const endIndex = section.indexOf('\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          path2 = section.substring(startIndex, endIndex).trim();
        }
      }
      
      // Create ad object
      const ad = {
        headline1: headlines[0] || campaignData.companyName || 'Innovative Solutions',
        headline2: headlines[1] || 'Premium Quality',
        headline3: headlines[2] || 'Get Started Today',
        description1: descriptions[0] || `Discover the best services for your needs. ${campaignData.callToAction?.[0] || 'Contact us today!'}`,
        description2: descriptions[1] || '',
        path1: path1 || 'services',
        path2: path2 || 'premium',
        siteLinks: [
          { title: 'About Us', link: '/about' },
          { title: 'Services', link: '/services' },
          { title: 'Contact', link: '/contact' },
          { title: campaignData.callToAction?.[0] || 'Get Started', link: '/start' }
        ]
      };
      
      ads.push(ad);
    }
    
    // If we couldn't extract any ads, use fallbacks
    if (ads.length === 0) {
      return generateFallbackGoogleAds(campaignData);
    }
    
    return ads;
  } catch (error) {
    console.error('Error extracting Google Ads from text:', error);
    return generateFallbackGoogleAds(campaignData);
  }
}

// Helper function to extract LinkedIn Ads from text
function extractLinkedInAdsFromText(text: string, campaignData: WebsiteAnalysisResult) {
  try {
    const ads = [];
    const adSections = text.split(/Ad \d+:|Ad Variation \d+:|LinkedIn Ad \d+:/i);
    
    // Skip the first element if it's just introductory text
    for (let i = 1; i < adSections.length; i++) {
      const section = adSections[i].trim();
      if (!section) continue;
      
      // Extract headline
      let headline = '';
      const headlineMatch = section.match(/Headline:|Title:/i);
      if (headlineMatch) {
        const startIndex = headlineMatch.index + headlineMatch[0].length;
        const endIndex = section.indexOf('\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          headline = section.substring(startIndex, endIndex).trim();
        }
      }
      
      // Extract primary text
      let primaryText = '';
      const primaryTextMatch = section.match(/Primary Text:|Body Text:|Main Text:/i);
      if (primaryTextMatch) {
        const startIndex = primaryTextMatch.index + primaryTextMatch[0].length;
        const endIndex = section.indexOf('\n\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          primaryText = section.substring(startIndex, endIndex).trim();
        } else if (startIndex !== -1) {
          // If there's no double newline, take everything until the end
          primaryText = section.substring(startIndex).trim();
        }
      }
      
      // Extract description (if any)
      let description = '';
      const descriptionMatch = section.match(/Description:|Secondary Text:|Sub-headline:/i);
      if (descriptionMatch) {
        const startIndex = descriptionMatch.index + descriptionMatch[0].length;
        const endIndex = section.indexOf('\n', startIndex);
        if (startIndex !== -1 && endIndex !== -1) {
          description = section.substring(startIndex, endIndex).trim();
        }
      }
      
      // If we couldn't extract structured data, try to infer from the content
      if (!headline && !primaryText) {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
          headline = lines[0].trim();
          primaryText = lines.slice(1).join('\n').trim();
        }
      }
      
      // Create ad object with fallbacks
      const ad = {
        headline: headline || campaignData.companyName || 'Innovative Professional Solutions',
        primaryText: primaryText || `Discover how our services can help your business grow. ${campaignData.callToAction?.[0] || 'Contact us today to learn more.'}`,
        description: description || campaignData.uniqueSellingPoints?.[0] || 'Industry-leading expertise',
        imagePrompt: `Professional image representing ${campaignData.companyName || 'business'} in the ${campaignData.businessDescription || 'professional'} industry`
      };
      
      ads.push(ad);
    }
    
    // If we couldn't extract any ads, use fallbacks
    if (ads.length === 0) {
      return generateFallbackLinkedInAds(campaignData);
    }
    
    return ads;
  } catch (error) {
    console.error('Error extracting LinkedIn Ads from text:', error);
    return generateFallbackLinkedInAds(campaignData);
  }
}

// Export all the fallback generators for direct use
export { 
  generateFallbackGoogleAds, 
  generateFallbackLinkedInAds,
  generateFallbackMicrosoftAds,
  generateFallbackMetaAds 
};
