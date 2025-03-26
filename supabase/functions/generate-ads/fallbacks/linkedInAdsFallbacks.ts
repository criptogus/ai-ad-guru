
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback LinkedIn Ads when the AI generation fails
 */
export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName;
  const description = campaignData.businessDescription || `Quality services from ${companyName}`;
  
  // Extract keywords if available, otherwise use defaults
  let keywords = ["professional", "service", "expert"];
  if (campaignData.keywords) {
    if (Array.isArray(campaignData.keywords)) {
      keywords = campaignData.keywords.slice(0, 3);
    } else {
      keywords = campaignData.keywords.split(',').slice(0, 3).map(k => k.trim());
    }
  }
  
  // Create five fallback LinkedIn ad variations
  return [
    {
      headline: `${companyName}: ${keywords[0] || 'Professional'} Solutions`,
      primaryText: `Looking for ${keywords[0] || 'professional'} services? ${companyName} provides industry-leading solutions designed to help your business grow.`,
      description: `Connect with our team today to learn more about our services.`,
      imagePrompt: `Professional business image representing ${companyName} with clean, corporate aesthetic suitable for LinkedIn`,
      format: "single-image",
      hashtags: [companyName.replace(/\s+/g, ''), "Professional", "Business"]
    },
    {
      headline: `Discover ${companyName}'s ${keywords[1] || 'Expert'} Services`,
      primaryText: `${description.substring(0, 100)}...`,
      description: `Ready to take your business to the next level? Contact us today.`,
      imagePrompt: `Professional team working together in a modern office environment, representing ${companyName}`,
      format: "single-image",
      hashtags: ["Business", "Growth", keywords[1] || "Expert"]
    },
    {
      headline: `${keywords[2] || 'Quality'} Solutions by ${companyName}`,
      primaryText: `At ${companyName}, we provide ${keywords[2] || 'quality'} solutions that help businesses achieve their goals. Our experienced team is ready to assist you.`,
      description: `Schedule a consultation with our experts today.`,
      imagePrompt: `Professional business meeting with potential clients discussing solutions, in a clean corporate setting`,
      format: "single-image",
      hashtags: ["Solutions", "Business", companyName.replace(/\s+/g, '')]
    },
    {
      headline: `Partner with ${companyName} Today`,
      primaryText: `Join the many businesses that trust ${companyName} for their ${keywords[0] || 'professional'} needs. Our dedicated team delivers exceptional results.`,
      description: `Learn how we can help you succeed. Contact us now.`,
      imagePrompt: `Professional handshake or partnership visualization in a corporate setting, representing ${companyName}`,
      format: "single-image",
      hashtags: ["Partnership", "Success", "Business"]
    },
    {
      headline: `${companyName}: Industry Leaders`,
      primaryText: `With years of experience and a commitment to excellence, ${companyName} has established itself as a leader in providing ${keywords[1] || 'expert'} solutions.`,
      description: `Discover the difference our services can make for your business.`,
      imagePrompt: `Professional image showing industry leadership with modern office or successful business people representing ${companyName}`,
      format: "single-image",
      hashtags: ["Leadership", "Excellence", keywords[2] || "Quality"]
    }
  ];
}
