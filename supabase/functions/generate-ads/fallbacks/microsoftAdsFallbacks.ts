
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Microsoft Ads when the AI generation fails
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult) {
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
  
  // Create five fallback Microsoft ad variations
  return [
    {
      headlines: [
        `${companyName} Services`,
        `${keywords[0] || 'Quality'} Solutions`,
        `Get Results Today`
      ],
      descriptions: [
        `Expert ${keywords[1] || 'professional'} services tailored to your needs. Contact us now.`,
        `${companyName} delivers reliable results backed by years of experience.`
      ]
    },
    {
      headlines: [
        `Discover ${companyName}`,
        `${keywords[0] || 'Quality'} Service`,
        `Contact Us Today`
      ],
      descriptions: [
        `Professional ${keywords[2] || 'service'} solutions for your business needs.`,
        `${companyName}: Your trusted partner for ${keywords[1] || 'professional'} service.`
      ]
    },
    {
      headlines: [
        `${keywords[0] || 'Quality'} Guaranteed`,
        `${companyName} Solutions`,
        `Learn More Now`
      ],
      descriptions: [
        `${description.substring(0, 70)}...`,
        `Contact us today to discuss your ${keywords[2] || 'service'} requirements.`
      ]
    },
    {
      headlines: [
        `${companyName} Experts`,
        `${keywords[1] || 'Professional'} Service`,
        `Schedule Now`
      ],
      descriptions: [
        `We provide ${keywords[0] || 'quality'} solutions that deliver real results.`,
        `${companyName} - The ${keywords[1] || 'professional'} choice for businesses.`
      ]
    },
    {
      headlines: [
        `${keywords[2] || 'Service'} Specialists`,
        `${companyName} Advantage`,
        `Explore Options`
      ],
      descriptions: [
        `Trusted by businesses for our ${keywords[0] || 'quality'} service and expertise.`,
        `${companyName} offers solutions designed for your success.`
      ]
    }
  ];
}
