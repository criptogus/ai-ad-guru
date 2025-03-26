
import { MetaAd } from "./types.ts";

/**
 * Generates fallback LinkedIn Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of MetaAd objects (since LinkedIn ads follow a similar format)
 */
export function generateFallbackLinkedInAds(campaignData: any): MetaAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const callToAction = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction[0] 
    : campaignData.callToAction || "Learn More";
  
  // Generate 3 fallback LinkedIn ads
  return [
    {
      headline: `Elevate Your Business with ${companyName}`,
      primaryText: `In today's competitive marketplace, staying ahead requires the right solutions. ${description.substring(0, 100)}... Our expert team helps businesses like yours achieve exceptional results through customized strategies and professional support.`,
      description: callToAction,
      imagePrompt: `Professional business meeting with executives discussing solutions, corporate setting with ${companyName} branding`,
      format: "square"
    },
    {
      headline: `${companyName}: Industry-Leading Solutions`,
      primaryText: `Looking to optimize your business operations and drive growth? Our comprehensive suite of services helps professionals and organizations streamline processes, reduce costs, and increase productivity. Join the thousands of satisfied clients who trust us for their business needs.`,
      description: `Contact Us | ${callToAction}`,
      imagePrompt: `Professional portrait of business executive using ${companyName} solutions, corporate office background`,
      format: "square"
    },
    {
      headline: `Strategic Partnership with ${companyName}`,
      primaryText: `Transform your business outcomes with our proven methodologies and expert consultation. We work closely with your team to identify opportunities, implement solutions, and measure results. Take your business to the next level with our specialized services.`,
      description: `Schedule a Consultation | ${callToAction}`,
      imagePrompt: `Business professionals shaking hands in modern office with ${companyName} logo visible`,
      format: "square"
    }
  ];
}
