
import { GoogleAd } from "./types.ts";

/**
 * Generates fallback Microsoft Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of GoogleAd objects (since Microsoft ads follow the same format)
 */
export function generateFallbackMicrosoftAds(campaignData: any): GoogleAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const callToAction = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction[0] 
    : campaignData.callToAction || "Learn More";
  
  // Generate 5 fallback Microsoft ads
  return [
    {
      headline1: `${companyName} Solutions`,
      headline2: "Top-Rated Services",
      headline3: "Get Started Today",
      description1: `${description.substring(0, 80)}...`,
      description2: `Visit our website to ${callToAction.toLowerCase()}. Contact us now!`,
      headlines: [`${companyName} Solutions`, "Top-Rated Services", "Get Started Today"],
      descriptions: [
        `${description.substring(0, 80)}...`,
        `Visit our website to ${callToAction.toLowerCase()}. Contact us now!`
      ]
    },
    {
      headline1: `Best ${companyName} Services`,
      headline2: "Professional & Reliable",
      headline3: "Book Now & Save",
      description1: "High-quality solutions tailored to your needs.",
      description2: "Trusted by thousands. See why our customers choose us.",
      headlines: [`Best ${companyName} Services`, "Professional & Reliable", "Book Now & Save"],
      descriptions: [
        "High-quality solutions tailored to your needs.",
        "Trusted by thousands. See why our customers choose us."
      ]
    },
    {
      headline1: `${companyName} - #1 Rated`,
      headline2: "Premium Services & Support",
      headline3: "Free Consultation",
      description1: "Expert solutions for your business needs.",
      description2: "30-day satisfaction guarantee. Get started today!",
      headlines: [`${companyName} - #1 Rated`, "Premium Services & Support", "Free Consultation"],
      descriptions: [
        "Expert solutions for your business needs.",
        "30-day satisfaction guarantee. Get started today!"
      ]
    },
    {
      headline1: "Special Limited Offer",
      headline2: `${companyName} Expert Services`,
      headline3: "Save 15% Today",
      description1: "Professional solutions with guaranteed results.",
      description2: "Rated 4.9/5 by our customers. Satisfaction guaranteed!",
      headlines: ["Special Limited Offer", `${companyName} Expert Services`, "Save 15% Today"],
      descriptions: [
        "Professional solutions with guaranteed results.",
        "Rated 4.9/5 by our customers. Satisfaction guaranteed!"
      ]
    },
    {
      headline1: `Official ${companyName} Site`,
      headline2: "25+ Years Experience",
      headline3: "Get Your Free Quote",
      description1: "Industry leading solutions for your specific needs.",
      description2: "24/7 customer support. Always available when you need us.",
      headlines: [`Official ${companyName} Site`, "25+ Years Experience", "Get Your Free Quote"],
      descriptions: [
        "Industry leading solutions for your specific needs.",
        "24/7 customer support. Always available when you need us."
      ]
    }
  ];
}
