
import { MetaAd } from "../types.ts";
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Meta/Instagram ads when AI generation fails
 */
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  const { 
    companyName = "Your Company", 
    businessDescription = "", 
    callToAction = ["Learn More"], 
    uniqueSellingPoints = ["Quality products and services"]
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

/**
 * Generates fallback LinkedIn ads when AI generation fails
 */
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  const { 
    companyName = "Your Company", 
    businessDescription = "", 
    callToAction = ["Learn More"], 
    uniqueSellingPoints = ["Industry-leading solutions"]
  } = campaignData;
  
  // Extract basic info for fallback content
  const description = businessDescription || `${companyName} professional solutions`;
  const cta = Array.isArray(callToAction) && callToAction.length > 0 
    ? callToAction[0] 
    : "Learn More";
  
  const usp = Array.isArray(uniqueSellingPoints) && uniqueSellingPoints.length > 0
    ? uniqueSellingPoints[0]
    : `Industry-leading solutions from ${companyName}`;

  // Create basic fallback ads for LinkedIn
  return [
    {
      headline: `Enhance Your Business with ${companyName}`,
      primaryText: `Looking to improve your business outcomes? ${companyName} provides professional solutions that deliver measurable results. Our team of experts is ready to help you achieve your business goals.`,
      description: cta,
      imagePrompt: `Professional business meeting with executives discussing strategy in a modern office setting`
    },
    {
      headline: `${companyName}: Industry Expertise`,
      primaryText: `${description}. With years of industry experience, we understand the challenges facing modern businesses. Our proven approach has helped organizations like yours overcome obstacles and achieve success.`,
      description: "Connect With Us",
      imagePrompt: `Professional portrait of a business expert or thought leader in a corporate environment`
    },
    {
      headline: `Grow Your Business with ${companyName}`,
      primaryText: `${usp}. Our data-driven approach ensures that your business receives the best possible solutions for your unique challenges. Join the thousands of satisfied clients who have transformed their operations.`,
      description: cta,
      imagePrompt: `Business growth graph or chart showing upward trajectory in a professional context`
    },
    {
      headline: `${companyName}: Professional Solutions`,
      primaryText: `Optimize your business processes with our professional services. We specialize in delivering tailored solutions that address your specific needs and drive measurable results for your organization.`,
      description: "Schedule Consultation",
      imagePrompt: `Professional consultants working with clients in a modern office environment`
    },
    {
      headline: `Partner with ${companyName}`,
      primaryText: `Looking for a strategic partner? ${companyName} offers comprehensive business solutions designed to enhance your competitive advantage. Our client-focused approach ensures we understand your unique requirements.`,
      description: cta,
      imagePrompt: `Business partnership handshake or collaboration in professional setting`
    }
  ];
}
