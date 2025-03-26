
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Meta/Instagram Ads when the AI generation fails
 */
export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName;
  const description = campaignData.businessDescription || `Quality services from ${companyName}`;
  
  // Extract keywords if available, otherwise use defaults
  let keywords = ["quality", "professional", "service"];
  if (campaignData.keywords) {
    if (Array.isArray(campaignData.keywords)) {
      keywords = campaignData.keywords.slice(0, 3);
    } else {
      keywords = campaignData.keywords.split(',').slice(0, 3).map(k => k.trim());
    }
  }
  
  // Create five fallback Meta/Instagram ad variations
  return [
    {
      headline: `Discover ${companyName}`,
      primaryText: `Experience ${keywords[0] || 'quality'} with ${companyName}. We're dedicated to providing the best solutions for our customers. Check out our services today!`,
      description: `Learn more about how we can help you.`,
      imagePrompt: `Vibrant, social media-friendly image representing ${companyName} with bright colors and clean aesthetic`,
      format: "square",
      hashtags: [companyName.replace(/\s+/g, ''), keywords[0] || "Quality", "Service"]
    },
    {
      headline: `${companyName}: ${keywords[1] || 'Professional'} Services`,
      primaryText: `${description.substring(0, 100)}...`,
      description: `Follow us for more information about our services.`,
      imagePrompt: `Eye-catching image showcasing ${companyName}'s services with modern, Instagram-friendly aesthetics`,
      format: "square",
      hashtags: ["Services", keywords[1] || "Professional", "Follow"]
    },
    {
      headline: `${keywords[2] || 'Service'} Excellence by ${companyName}`,
      primaryText: `We pride ourselves on providing top-notch ${keywords[2] || 'service'} to all our customers. Discover the difference with ${companyName}.`,
      description: `Connect with us to learn more about what we offer.`,
      imagePrompt: `Clean, minimalist image showcasing excellence and quality that represents ${companyName}`,
      format: "square",
      hashtags: ["Excellence", companyName.replace(/\s+/g, ''), "Connect"]
    },
    {
      headline: `${companyName} - Your Trusted Partner`,
      primaryText: `Looking for reliable ${keywords[0] || 'quality'} solutions? ${companyName} has you covered. We're committed to helping you succeed.`,
      description: `Visit our profile to see more of what we offer.`,
      imagePrompt: `Warm, inviting image that conveys trust and partnership for ${companyName}`,
      format: "square",
      hashtags: ["Trusted", "Partner", keywords[0] || "Quality"]
    },
    {
      headline: `Experience the ${companyName} Difference`,
      primaryText: `What makes ${companyName} different? Our dedication to ${keywords[1] || 'professional'} service and customer satisfaction. See for yourself!`,
      description: `Follow our page for more updates and information.`,
      imagePrompt: `Distinctive, appealing image that highlights what makes ${companyName} unique and special`,
      format: "square",
      hashtags: ["Different", "Experience", keywords[1] || "Professional"]
    }
  ];
}
