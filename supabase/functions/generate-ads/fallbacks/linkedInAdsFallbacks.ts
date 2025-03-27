
import { MetaAd } from "../types.ts";
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback LinkedIn ads when AI generation fails
 */
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult): MetaAd[] {
  const { 
    companyName, 
    businessDescription, 
    callToAction, 
    uniqueSellingPoints 
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
