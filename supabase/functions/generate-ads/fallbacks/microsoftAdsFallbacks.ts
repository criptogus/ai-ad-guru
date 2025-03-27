
import { GoogleAd } from "./types.ts";

/**
 * Generates fallback Microsoft Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of MicrosoftAd objects (using GoogleAd interface for compatibility)
 */
export function generateFallbackMicrosoftAds(campaignData: any): GoogleAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const callToAction = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction[0] 
    : campaignData.callToAction || "Learn More";
  
  // Generate 5 fallback Microsoft ads (similar to Google Ads format)
  return [
    {
      headline1: `${companyName} Solutions`,
      headline2: "Trusted Microsoft Partner",
      headline3: "Get Expert Assistance",
      description1: `${description.substring(0, 80)}...`,
      description2: `Visit our website to ${callToAction.toLowerCase()}. Contact us today!`,
      headlines: [`${companyName} Solutions`, "Trusted Microsoft Partner", "Get Expert Assistance"],
      descriptions: [
        `${description.substring(0, 80)}...`,
        `Visit our website to ${callToAction.toLowerCase()}. Contact us today!`
      ]
    },
    {
      headline1: `Official ${companyName} Site`,
      headline2: "Microsoft Certified Solutions",
      headline3: "Start Your Free Trial",
      description1: "Professional services with guaranteed results.",
      description2: "24/7 customer support. Always here when you need us.",
      headlines: [`Official ${companyName} Site`, "Microsoft Certified Solutions", "Start Your Free Trial"],
      descriptions: [
        "Professional services with guaranteed results.",
        "24/7 customer support. Always here when you need us."
      ]
    },
    {
      headline1: `${companyName} - Best Choice`,
      headline2: "Microsoft Approved Service",
      headline3: "Book Consultation Today",
      description1: "Expert solutions for your business needs.",
      description2: "Trusted by thousands. See why customers love us.",
      headlines: [`${companyName} - Best Choice`, "Microsoft Approved Service", "Book Consultation Today"],
      descriptions: [
        "Expert solutions for your business needs.",
        "Trusted by thousands. See why customers love us."
      ]
    },
    {
      headline1: "Limited Time Offer",
      headline2: `${companyName} Pro Package`,
      headline3: "Save 20% This Month",
      description1: "Get the best service at competitive prices.",
      description2: "Rated 4.8/5 by our clients. Satisfaction guaranteed!",
      headlines: ["Limited Time Offer", `${companyName} Pro Package`, "Save 20% This Month"],
      descriptions: [
        "Get the best service at competitive prices.",
        "Rated 4.8/5 by our clients. Satisfaction guaranteed!"
      ]
    },
    {
      headline1: `${companyName} for Business`,
      headline2: "Enterprise-Grade Solutions",
      headline3: "Schedule Demo Today",
      description1: "Scalable solutions designed for businesses of all sizes.",
      description2: "Used by over 10,000 companies worldwide. Join them today!",
      headlines: [`${companyName} for Business`, "Enterprise-Grade Solutions", "Schedule Demo Today"],
      descriptions: [
        "Scalable solutions designed for businesses of all sizes.",
        "Used by over 10,000 companies worldwide. Join them today!"
      ]
    }
  ];
}
