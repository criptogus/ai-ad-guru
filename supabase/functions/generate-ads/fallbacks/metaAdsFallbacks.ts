
import { MetaAd } from "./types.ts";

/**
 * Generates fallback Meta Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of MetaAd objects
 */
export function generateFallbackMetaAds(campaignData: any): MetaAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const targetAudience = campaignData.targetAudience || "Our customers";
  
  // Generate 3 fallback Meta/Instagram ads
  return [
    {
      headline: `Transform with ${companyName}`,
      primaryText: `Looking for a change? ${description} We've helped countless ${targetAudience} achieve their goals. Tap to learn more!`,
      description: "Learn More",
      imagePrompt: `A professional, bright image showing ${companyName} services in action, with happy customers and a modern aesthetic. Inspirational and engaging.`,
      imageUrl: "https://placehold.co/1024x1024/3B82F6/FFFFFF/png?text=Instagram+Ad"
    },
    {
      headline: `${companyName} - Your Partner in Success`,
      primaryText: `Don't settle for second best. Our proven solutions help ${targetAudience} get real results. Check out what we can do for you today!`,
      description: "Shop Now",
      imagePrompt: `A before and after transformation showing the impact of ${companyName}'s solutions, visually striking and professional.`,
      imageUrl: "https://placehold.co/1024x1024/3B82F6/FFFFFF/png?text=Instagram+Ad"
    },
    {
      headline: `Special Offer from ${companyName}`,
      primaryText: `Limited time only! Take advantage of our exclusive offer designed specifically for ${targetAudience}. Don't miss out on this opportunity!`,
      description: "Get Offer",
      imagePrompt: `An eye-catching promotional image for ${companyName} with vibrant colors, showing the product/service with a sense of urgency and excitement.`,
      imageUrl: "https://placehold.co/1024x1024/3B82F6/FFFFFF/png?text=Instagram+Ad"
    }
  ];
}
