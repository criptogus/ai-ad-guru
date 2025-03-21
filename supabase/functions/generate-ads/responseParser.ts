
import { WebsiteAnalysisResult } from "./types.ts";

// Parse ad response based on platform
export function parseAdResponse(responseText: string, platform: string, campaignData: WebsiteAnalysisResult) {
  console.log(`Parsing ${platform} ad response from OpenAI`);
  
  try {
    // Try to parse the response as JSON
    let data;
    try {
      // Extract JSON if it's wrapped in code blocks or has extra text
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                         responseText.match(/```([\s\S]*?)```/) ||
                         responseText.match(/\[([\s\S]*?)\]/);
      
      const jsonText = jsonMatch ? jsonMatch[1] : responseText;
      data = JSON.parse(jsonText.includes('[') ? jsonText : `[${jsonText}]`);
    } catch (jsonError) {
      // If direct parsing fails, try to find and extract the JSON part
      console.log("Initial JSON parsing failed, trying to extract JSON part:", jsonError);
      
      // Look for patterns that might indicate JSON content
      const startIdx = responseText.indexOf('[');
      const endIdx = responseText.lastIndexOf(']') + 1;
      
      if (startIdx >= 0 && endIdx > startIdx) {
        const jsonPart = responseText.substring(startIdx, endIdx);
        data = JSON.parse(jsonPart);
      } else {
        throw new Error("Could not extract JSON content from response");
      }
    }
    
    console.log(`Successfully parsed ${platform} ad data:`, data);
    return data;
  } catch (error) {
    console.error(`Error parsing ${platform} ad response:`, error);
    console.log("Response text:", responseText);
    
    // Return fallback data based on platform
    if (platform === 'google') {
      return generateFallbackGoogleAds(campaignData);
    } else if (platform === 'linkedin') {
      return generateFallbackLinkedInAds(campaignData);
    } else if (platform === 'microsoft') {
      return generateFallbackMicrosoftAds(campaignData);
    } else if (platform === 'meta') {
      return generateFallbackMetaAds(campaignData);
    } else {
      return [];
    }
  }
}

// Generate fallback Google ads if API fails
export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Our Company';
  const description = campaignData.businessDescription?.substring(0, 60) || 'Quality products and services';
  
  return [
    {
      headlines: [
        `${companyName}`,
        `Top Rated ${companyName}`,
        `Visit ${companyName} Today`
      ],
      descriptions: [
        `${description}. Contact us today!`,
        `Learn more about our services and solutions.`
      ]
    },
    {
      headlines: [
        `${companyName} - Official Site`,
        `Best in Class Solutions`,
        `Get Started Today`
      ],
      descriptions: [
        `${description}. Professional service guaranteed.`,
        `Call us or visit our website for more information.`
      ]
    }
  ];
}

// Generate fallback LinkedIn ads if API fails
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Our Company';
  const description = campaignData.businessDescription?.substring(0, 100) || 'Quality professional services';
  const industry = getIndustryFromDescription(campaignData.businessDescription || '');
  
  return [
    {
      headline: `${companyName} - Industry Leaders`,
      primaryText: `${description} Our team of experts is ready to help you succeed in today's competitive market.`,
      description: `Learn More About Our Services`,
      imagePrompt: `Professional business image of a modern office with people working, suitable for ${industry} industry, high quality, corporate style`
    },
    {
      headline: `Grow Your Business with ${companyName}`,
      primaryText: `${description} We provide cutting-edge solutions that drive results and deliver value.`,
      description: `Connect With Us Today`,
      imagePrompt: `Professional image showing business growth concept with upward trending graph, suitable for ${industry} industry, corporate style`
    }
  ];
}

// Generate fallback Microsoft ads if API fails
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Our Company';
  const description = campaignData.businessDescription?.substring(0, 60) || 'Quality products and services';
  
  return [
    {
      headlines: [
        `${companyName} Official`,
        `Industry Leaders`,
        `Contact Us Today`
      ],
      descriptions: [
        `${description}. Professional service guaranteed.`,
        `Visit our website for more information.`
      ]
    },
    {
      headlines: [
        `${companyName} Services`,
        `Top Rated Solutions`,
        `Learn More Now`
      ],
      descriptions: [
        `${description}. Expert team ready to assist.`,
        `Free consultation available. Call now.`
      ]
    }
  ];
}

// Generate fallback Meta ads if API fails
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Our Company';
  const description = campaignData.businessDescription?.substring(0, 100) || 'Quality products and services';
  const industry = getIndustryFromDescription(campaignData.businessDescription || '');
  
  return [
    {
      headline: `Discover ${companyName}`,
      primaryText: `${description.substring(0, 150)} We're dedicated to providing exceptional service and value.`,
      description: `Learn More`,
      imagePrompt: `Lifestyle photo of people using a product or service in the ${industry} industry, bright, engaging, Instagram-style photo with good lighting`
    },
    {
      headline: `${companyName} - New Collection`,
      primaryText: `Explore our latest offerings designed to meet your needs. ${description.substring(0, 100)}`,
      description: `Shop Now`,
      imagePrompt: `Styled product photography with aesthetic lighting showing a product or service from ${industry} industry, with Instagram-friendly colors and composition`
    },
    {
      headline: `Join the ${companyName} Community`,
      primaryText: `Thousands of satisfied customers have chosen us. Here's why you should too. ${description.substring(0, 80)}`,
      description: `Sign Up Today`,
      imagePrompt: `Community of diverse people engaged with a product or service in the ${industry} industry, warm tones, lifestyle photography, Instagram-style`
    }
  ];
}

// Helper function to extract industry from description
function getIndustryFromDescription(description: string): string {
  const industries = [
    'technology', 'finance', 'healthcare', 'education', 
    'retail', 'manufacturing', 'marketing', 'real estate',
    'consulting', 'entertainment', 'hospitality', 'automotive'
  ];
  
  const lowerDesc = description.toLowerCase();
  
  for (const industry of industries) {
    if (lowerDesc.includes(industry)) {
      return industry;
    }
  }
  
  // Default industry if none detected
  return 'business';
}
