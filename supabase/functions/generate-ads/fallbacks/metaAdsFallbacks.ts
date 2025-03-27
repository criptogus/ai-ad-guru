
import { MetaAd } from "../types.ts";
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Meta/Instagram ads when AI generation fails
 */
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  const { 
    companyName, 
    businessDescription, 
    callToAction, 
    uniqueSellingPoints 
  } = campaignData;
  
  // Extract basic info for fallback content
  const description = businessDescription || `${companyName} products and services`;
  const cta = Array.isArray(callToAction) && callToAction.length > 0 
    ? callToAction[0] 
    : "Learn More";
  
  const usp = Array.isArray(uniqueSellingPoints) && uniqueSellingPoints.length > 0
    ? uniqueSellingPoints[0]
    : `Quality products from ${companyName}`;

  // Create basic fallback ads
  return [
    {
      headline: `Discover ${companyName}`,
      primaryText: `Looking for quality solutions? ${companyName} offers everything you need. Our products are designed with you in mind. #quality #service #excellence`,
      description: cta,
      imagePrompt: `Professional image showcasing ${companyName} products or services`
    },
    {
      headline: `Try ${companyName} Today`,
      primaryText: `${description} - designed to exceed your expectations. See why customers love our solutions. #customer #satisfaction #products`,
      description: "Shop Now",
      imagePrompt: `Lifestyle image of people using ${companyName} products`
    },
    {
      headline: `${companyName} - Excellence Delivered`,
      primaryText: `${usp}. We pride ourselves on delivering exceptional quality and service to each customer. Try us today and see the difference. #quality #service #premium`,
      description: cta,
      imagePrompt: `Professional and elegant product display for ${companyName}`
    },
    {
      headline: `Special Offer from ${companyName}`,
      primaryText: `Limited time offer! Discover why our customers can't stop talking about our products. Quality and satisfaction guaranteed. #special #offer #limited`,
      description: "Get Offer",
      imagePrompt: `Promotional image showing ${companyName} products with a discount tag or special offer label`
    },
    {
      headline: `${companyName} - Your Best Choice`,
      primaryText: `When it comes to ${description}, we deliver the best. Our customers trust us for quality and reliability. Join them today! #best #trusted #reliable`,
      description: cta,
      imagePrompt: `Trustworthy professional image representing ${companyName}'s brand values`
    }
  ];
}
