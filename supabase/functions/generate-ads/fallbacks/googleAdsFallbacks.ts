
import { GoogleAd } from "./types.ts";

/**
 * Generates fallback Google Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of GoogleAd objects
 */
export function generateFallbackGoogleAds(campaignData: any): GoogleAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const callToAction = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction[0] 
    : campaignData.callToAction || "Learn More";
  
  // Generate 5 fallback Google ads
  return [
    {
      headline1: `${companyName} Services`,
      headline2: "High Quality & Reliable",
      headline3: "Contact Us Today",
      description1: `${description.substring(0, 80)}...`,
      description2: `Visit our website to ${callToAction.toLowerCase()}. Call now!`,
      headlines: [`${companyName} Services`, "High Quality & Reliable", "Contact Us Today"],
      descriptions: [
        `${description.substring(0, 80)}...`,
        `Visit our website to ${callToAction.toLowerCase()}. Call now!`
      ]
    },
    {
      headline1: `Top Rated ${companyName}`,
      headline2: "Expert Service & Support",
      headline3: "Free Quote Available",
      description1: "Professional solutions tailored to your needs.",
      description2: "100% satisfaction guaranteed. Contact us today!",
      headlines: [`Top Rated ${companyName}`, "Expert Service & Support", "Free Quote Available"],
      descriptions: [
        "Professional solutions tailored to your needs.",
        "100% satisfaction guaranteed. Contact us today!"
      ]
    },
    {
      headline1: `${companyName} - Best Choice`,
      headline2: "Award-Winning Service",
      headline3: "Book Now & Save",
      description1: "Expert solutions for your business needs.",
      description2: "Trusted by thousands. See why customers love us.",
      headlines: [`${companyName} - Best Choice`, "Award-Winning Service", "Book Now & Save"],
      descriptions: [
        "Expert solutions for your business needs.",
        "Trusted by thousands. See why customers love us."
      ]
    },
    {
      headline1: "Limited Time Offer",
      headline2: `${companyName} Solutions`,
      headline3: "Save 20% This Month",
      description1: "Get the best service at competitive prices.",
      description2: "Rated 4.8/5 by our clients. Satisfaction guaranteed!",
      headlines: ["Limited Time Offer", `${companyName} Solutions`, "Save 20% This Month"],
      descriptions: [
        "Get the best service at competitive prices.",
        "Rated 4.8/5 by our clients. Satisfaction guaranteed!"
      ]
    },
    {
      headline1: `${companyName} Official Site`,
      headline2: "20+ Years Experience",
      headline3: "Get Started Today",
      description1: "Professional services with guaranteed results.",
      description2: "24/7 customer support. Always here when you need us.",
      headlines: [`${companyName} Official Site`, "20+ Years Experience", "Get Started Today"],
      descriptions: [
        "Professional services with guaranteed results.",
        "24/7 customer support. Always here when you need us."
      ]
    }
  ];
}
