
import { WebsiteAnalysisResult } from "./types.ts";
import { GoogleAd, MetaAd, LinkedInAd, MicrosoftAd } from "./types.ts";

/**
 * Generate fallback Google ads when the OpenAI call fails
 */
export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult): GoogleAd[] {
  const { companyName, businessDescription, callToAction, keywords } = campaignData;
  const shortDescription = businessDescription.substring(0, 80);
  const cta = Array.isArray(callToAction) ? callToAction[0] : callToAction;
  const keywordText = Array.isArray(keywords) ? keywords.slice(0, 3).join(", ") : keywords;

  return [
    {
      headline1: `${companyName} - Professional Services`,
      headline2: "Quality Solutions",
      headline3: "Contact Us Today",
      description1: shortDescription || `Professional services by ${companyName}.`,
      description2: cta || "Get in touch now!",
      headlines: [
        `${companyName} - Professional Services`,
        "Quality Solutions",
        "Contact Us Today"
      ],
      descriptions: [
        shortDescription || `Professional services by ${companyName}.`,
        cta || "Get in touch now!"
      ],
      path1: "services",
      path2: "professional"
    },
    {
      headline1: `${companyName} | ${keywordText}`,
      headline2: "Expert Solutions",
      headline3: "Learn More",
      description1: shortDescription || `${companyName} offers professional services.`,
      description2: cta || "Contact us for details!",
      headlines: [
        `${companyName} | ${keywordText}`,
        "Expert Solutions",
        "Learn More"
      ],
      descriptions: [
        shortDescription || `${companyName} offers professional services.`,
        cta || "Contact us for details!"
      ],
      path1: "solutions",
      path2: "expert"
    },
    {
      headline1: `Discover ${companyName}`,
      headline2: "Premium Services",
      headline3: "Results Guaranteed",
      description1: shortDescription || `Experience the difference with ${companyName}.`,
      description2: cta || "Reach out today!",
      headlines: [
        `Discover ${companyName}`,
        "Premium Services",
        "Results Guaranteed"
      ],
      descriptions: [
        shortDescription || `Experience the difference with ${companyName}.`,
        cta || "Reach out today!"
      ],
      path1: "discover",
      path2: "premium"
    },
    {
      headline1: `${companyName} - Top Rated`,
      headline2: "Trusted by Clients",
      headline3: "Free Consultation",
      description1: shortDescription || `Join our satisfied customers at ${companyName}.`,
      description2: cta || "Schedule a call now!",
      headlines: [
        `${companyName} - Top Rated`,
        "Trusted by Clients",
        "Free Consultation"
      ],
      descriptions: [
        shortDescription || `Join our satisfied customers at ${companyName}.`,
        cta || "Schedule a call now!"
      ],
      path1: "consultation",
      path2: "trusted"
    },
    {
      headline1: `${companyName} Solutions`,
      headline2: "Professional Team",
      headline3: "Start Today",
      description1: shortDescription || `${companyName} delivers excellence in every project.`,
      description2: cta || "Get started now!",
      headlines: [
        `${companyName} Solutions`,
        "Professional Team",
        "Start Today"
      ],
      descriptions: [
        shortDescription || `${companyName} delivers excellence in every project.`,
        cta || "Get started now!"
      ],
      path1: "solutions",
      path2: "professional"
    }
  ];
}

/**
 * Generate fallback Meta/Instagram ads when the OpenAI call fails
 */
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  const { companyName, businessDescription, callToAction, uniqueSellingPoints } = campaignData;
  const shortDescription = businessDescription.substring(0, 100);
  const cta = Array.isArray(callToAction) ? callToAction[0] : callToAction;
  const sellingPoint = Array.isArray(uniqueSellingPoints) && uniqueSellingPoints.length > 0 
    ? uniqueSellingPoints[0] 
    : `Quality service by ${companyName}`;

  return [
    {
      headline: `Transform with ${companyName}`,
      primaryText: shortDescription || `Discover how ${companyName} can help you achieve more.`,
      description: cta || "Learn More",
      imagePrompt: `Professional photo representing ${companyName}'s services`,
      format: "feed"
    },
    {
      headline: `Experience ${companyName}`,
      primaryText: `${sellingPoint}. ${shortDescription || `At ${companyName}, we deliver exceptional results.`}`,
      description: cta || "Discover More",
      imagePrompt: `Creative branded image for ${companyName}`,
      format: "feed"
    },
    {
      headline: `${companyName} - Your Solution`,
      primaryText: shortDescription || `Looking for the best? ${companyName} delivers results that exceed expectations.`,
      description: cta || "Contact Now",
      imagePrompt: `Professional ${companyName} service image`,
      format: "feed"
    }
  ];
}

/**
 * Generate fallback LinkedIn ads when the OpenAI call fails
 */
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): LinkedInAd[] {
  // Since we're using Meta format for LinkedIn, convert the Meta ads
  return generateFallbackMetaAds(campaignData) as unknown as LinkedInAd[];
}

/**
 * Generate fallback Microsoft ads when the OpenAI call fails
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult): MicrosoftAd[] {
  // For Microsoft ads, we can use the Google ad format
  return generateFallbackGoogleAds(campaignData) as unknown as MicrosoftAd[];
}
