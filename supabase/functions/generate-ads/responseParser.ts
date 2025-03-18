
import { GoogleAd, MetaAd } from "./types.ts";
import { WebsiteAnalysisResult } from "./types.ts";

// Generate fallback Google Ads
export const generateFallbackGoogleAds = (campaignData: WebsiteAnalysisResult) => {
  return [
    {
      headlines: [
        `${campaignData.companyName} Services`,
        "Professional Quality",
        "Contact Us Today"
      ],
      descriptions: [
        `${campaignData.businessDescription.substring(0, 80)}...`,
        `${campaignData.callToAction[0] || 'Contact us'} Visit our website now.`
      ]
    },
    {
      headlines: [
        "Expert Solutions",
        `${campaignData.companyName}`,
        "Trusted Provider"
      ],
      descriptions: [
        "Top-rated services tailored to your needs. Quality guaranteed.",
        `${campaignData.callToAction[0] || 'Learn more'} Don't wait.`
      ]
    },
    {
      headlines: [
        "Special Offer Inside",
        "Premium Services",
        `${campaignData.companyName}`
      ],
      descriptions: [
        "Discover how we can help you achieve your goals today.",
        `${campaignData.callToAction[0] || 'Get started'} Learn more now.`
      ]
    },
    {
      headlines: [
        "Quality Guaranteed",
        `${campaignData.companyName}`,
        "Professional Service"
      ],
      descriptions: [
        "We deliver exceptional results every time. Satisfaction guaranteed.",
        `${campaignData.callToAction[0] || 'Explore'} See why clients love us.`
      ]
    },
    {
      headlines: [
        "Limited Time Discount",
        `Best in ${campaignData.companyName}`,
        "Act Now & Save"
      ],
      descriptions: [
        "Don't miss our special offer available for a limited time only.",
        `${campaignData.callToAction[0] || 'Call now'} Offer ends soon.`
      ]
    }
  ];
};

// Generate fallback Meta Ads
export const generateFallbackMetaAds = (campaignData: WebsiteAnalysisResult) => {
  return [
    {
      primaryText: `✨ Transform your experience with ${campaignData.companyName}! ${campaignData.uniqueSellingPoints[0] || 'High quality service'} ${campaignData.callToAction[0] || 'Contact us today!'}`,
      headline: "Discover the Difference",
      description: "Premium Quality",
      imagePrompt: `Professional advertisement for ${campaignData.companyName}, showing their services in action with a clean, modern aesthetic. ${campaignData.brandTone} style.`
    },
    {
      primaryText: `🚀 Ready for a change? ${campaignData.companyName} delivers results that matter! ${campaignData.uniqueSellingPoints[0] || 'Superior service'} ${campaignData.callToAction[0] || 'Get started now!'}`,
      headline: "Excellence Delivered",
      description: "See the Difference",
      imagePrompt: `Eye-catching advertisement showcasing ${campaignData.companyName}'s unique value proposition with vibrant colors and professional imagery. ${campaignData.brandTone} feel.`
    },
    {
      primaryText: `💯 Don't settle for less! ${campaignData.companyName} - where quality meets exceptional service. ${campaignData.callToAction[0] || 'Reach out today!'}`,
      headline: "The Smart Choice",
      description: "Join Satisfied Customers",
      imagePrompt: `High-quality advertisement featuring satisfied customers experiencing ${campaignData.companyName}'s services, with a ${campaignData.brandTone} atmosphere.`
    }
  ];
};

// Parse OpenAI response into properly formatted ads
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
