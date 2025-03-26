
import { MetaAd } from "./types.ts";

/**
 * Generates fallback Meta (Instagram) Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of MetaAd objects
 */
export function generateFallbackMetaAds(campaignData: any): MetaAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const callToAction = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction[0] 
    : campaignData.callToAction || "Learn More";
  
  // Generate 3 fallback Meta ads
  return [
    {
      headline: `Discover ${companyName}`,
      primaryText: `Transform your experience with our premium solutions. ${description.substring(0, 100)}... Designed with you in mind, our services deliver exceptional results every time.`,
      description: callToAction,
      imagePrompt: `Professional lifestyle image showcasing ${companyName} services, bright modern aesthetic, aspirational`,
      hashtags: ["#QualityService", "#PremiumExperience", "#Innovation"]
    },
    {
      headline: `Experience the ${companyName} Difference`,
      primaryText: `Why settle for less when you can have the best? Our team of experts is ready to deliver outstanding results that exceed your expectations. Join our satisfied customers today!`,
      description: `Shop Now | ${callToAction}`,
      imagePrompt: `Clean product showcase of ${companyName} offerings with minimalist background, professional lighting`,
      hashtags: ["#BestService", "#CustomerSatisfaction", "#ExpertSolutions"]
    },
    {
      headline: `Limited Time Offer from ${companyName}`,
      primaryText: `Don't miss out on our special promotion! For a limited time, get exclusive access to our premium services at special rates. Act now before this offer expires.`,
      description: `Limited Time | ${callToAction}`,
      imagePrompt: `Eye-catching promotional image for ${companyName} with bold text overlay announcing special offer`,
      hashtags: ["#SpecialOffer", "#LimitedTimeOffer", "#ExclusiveDeal"]
    }
  ];
}
