
import { WebsiteAnalysisResult, GoogleAd, LinkedInAd, MicrosoftAd } from "./types.ts";
import { generateFallbackGoogleAds as googleFallbacks } from "./fallbacks/googleAdsFallbacks.ts";

// Parse raw JSON response from OpenAI into structured ad objects
export const parseAdResponse = (responseText: string | null, platform: string, campaignData: WebsiteAnalysisResult) => {
  if (!responseText) {
    console.error("Empty response from OpenAI");
    return platform === 'google' 
      ? generateFallbackGoogleAds(campaignData)
      : platform === 'linkedin'
      ? generateFallbackLinkedInAds(campaignData)
      : generateFallbackMicrosoftAds(campaignData);
  }
  
  try {
    // Extract JSON array from response text, in case OpenAI adds extra text
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      console.error("No JSON array found in response:", responseText);
      return platform === 'google' 
        ? generateFallbackGoogleAds(campaignData)
        : platform === 'linkedin'
        ? generateFallbackLinkedInAds(campaignData)
        : generateFallbackMicrosoftAds(campaignData);
    }
    
    const jsonString = jsonMatch[0];
    const parsedData = JSON.parse(jsonString);
    
    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.error("No valid ad data found in parsed response:", parsedData);
      return platform === 'google' 
        ? generateFallbackGoogleAds(campaignData)
        : platform === 'linkedin'
        ? generateFallbackLinkedInAds(campaignData)
        : generateFallbackMicrosoftAds(campaignData);
    }

    // For LinkedIn ads, validate and clean
    if (platform === 'linkedin') {
      return validateAndCleanLinkedInAds(parsedData, campaignData);
    }
    
    // For Google and Microsoft ads, validate headlines and descriptions
    return parsedData.map((ad: any, index: number) => {
      // Ensure all required fields exist
      return {
        headlines: Array.isArray(ad.headlines) ? 
          ad.headlines.slice(0, 3).map((h: string) => h.substring(0, 30)) : 
          [`${campaignData.companyName}`, "Quality Services", "Learn More"].map(h => h.substring(0, 30)),
        descriptions: Array.isArray(ad.descriptions) ? 
          ad.descriptions.slice(0, 2).map((d: string) => d.substring(0, 90)) : 
          ["We provide top-quality services for your business needs.", "Contact us today to learn more!"].map(d => d.substring(0, 90))
      };
    });
    
  } catch (error) {
    console.error("Error parsing OpenAI response:", error, "Raw response:", responseText);
    return platform === 'google' 
      ? generateFallbackGoogleAds(campaignData)
      : platform === 'linkedin'
      ? generateFallbackLinkedInAds(campaignData)
      : generateFallbackMicrosoftAds(campaignData);
  }
};

// Generate fallback Google ads
export const generateFallbackGoogleAds = (campaignData: WebsiteAnalysisResult): GoogleAd[] => {
  return googleFallbacks(campaignData);
};

// Validate and clean LinkedIn ads
const validateAndCleanLinkedInAds = (parsedData: any[], campaignData: WebsiteAnalysisResult): LinkedInAd[] => {
  return parsedData.map((ad: any) => {
    return {
      headline: ad.headline?.substring(0, 150) || `${campaignData.companyName} - Professional Solutions`,
      primaryText: ad.primaryText?.substring(0, 600) || `Looking for innovative business solutions? ${campaignData.companyName} offers cutting-edge services tailored for professionals like you.`,
      description: ad.description?.substring(0, 600) || `${campaignData.companyName} provides professional solutions for businesses. Our services are designed to meet your specific needs and help your business grow.`,
      imagePrompt: ad.imagePrompt || `Professional image of business people in a modern office setting for ${campaignData.companyName}`
    };
  });
};

// Generate fallback LinkedIn ads
export const generateFallbackLinkedInAds = (campaignData: WebsiteAnalysisResult): LinkedInAd[] => {
  const { companyName, businessDescription = "", targetAudience = "business professionals" } = campaignData;
  
  const shortDesc = businessDescription.substring(0, 100);
  
  return [
    {
      headline: `${companyName} - Professional Solutions for Your Business`,
      primaryText: `Are you looking to optimize your business operations and drive growth? At ${companyName}, we understand the challenges that modern businesses face in today's competitive landscape.`,
      description: `${shortDesc} We provide top-quality services tailored to meet the needs of ${targetAudience}. Contact us today to learn how we can help your business grow and succeed in today's competitive market.`,
      imagePrompt: `Professional image of business people in a modern office setting for ${companyName}`
    },
    {
      headline: `Transform Your Business with ${companyName}`,
      primaryText: `In today's fast-paced business environment, staying ahead requires innovative solutions and strategic partnerships. ${companyName} delivers results that matter.`,
      description: `Looking for innovative solutions? ${companyName} offers cutting-edge services designed to boost your productivity and ROI. Join hundreds of satisfied clients who have already elevated their business performance with our expert solutions.`,
      imagePrompt: `Clean, professional image showing business growth chart or success metrics for ${companyName}`
    },
    {
      headline: `${companyName}: Industry Leaders in Professional Solutions`,
      primaryText: `What separates industry leaders from the competition? The right tools, strategies, and partners. ${companyName} helps businesses reach their full potential.`,
      description: `With years of experience serving ${targetAudience}, we understand your unique challenges. Our team of experts is ready to provide customized solutions that drive real results. Schedule a consultation today to discover how we can support your business goals.`,
      imagePrompt: `Professional team of diverse business experts representing ${companyName} in a corporate setting`
    }
  ];
};

// Generate fallback Microsoft ads
export const generateFallbackMicrosoftAds = (campaignData: WebsiteAnalysisResult): MicrosoftAd[] => {
  const { companyName } = campaignData;
  
  return [
    {
      headlines: [
        `${companyName}`,
        "Professional Services",
        "Contact Us Today"
      ],
      descriptions: [
        "We provide top-quality business solutions designed for Microsoft ecosystem users.",
        "Search on Bing to find more about our exclusive offers and services."
      ]
    },
    {
      headlines: [
        `${companyName} Solutions`,
        "Premium Business Tools",
        "Learn More Now"
      ],
      descriptions: [
        "Tailored services for businesses using Microsoft technologies and platforms.",
        "Discover how we can enhance your business operations and productivity."
      ]
    },
    {
      headlines: [
        `Discover ${companyName}`,
        "Enterprise-Grade Services",
        "Schedule Demo Today"
      ],
      descriptions: [
        "Professional solutions designed for Microsoft users and business professionals.",
        "Optimize your workflow with our specialized services and expert support."
      ]
    },
    {
      headlines: [
        `${companyName} Experts`,
        "Microsoft-Compatible",
        "Free Consultation"
      ],
      descriptions: [
        "Our services integrate seamlessly with Microsoft Office, Azure, and the entire ecosystem.",
        "Trusted by businesses who rely on Microsoft technologies for their operations."
      ]
    },
    {
      headlines: [
        `Business Solutions`,
        `${companyName} Services`,
        "Book a Meeting"
      ],
      descriptions: [
        "Professional services tailored for Bing users and Microsoft professionals.",
        "Enhance your business performance with our specialized solutions."
      ]
    }
  ];
};
