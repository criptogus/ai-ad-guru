
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Microsoft Ads when the AI generation fails
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName;
  const description = campaignData.businessDescription || `Quality services from ${companyName}`;
  
  // Extract keywords if available, otherwise use defaults
  let keywords = ["service", "quality", "professional"];
  if (campaignData.keywords) {
    if (Array.isArray(campaignData.keywords)) {
      keywords = campaignData.keywords.slice(0, 3);
    } else {
      keywords = campaignData.keywords.split(',').slice(0, 3).map(k => k.trim());
    }
  }
  
  // Extract call to actions if available
  let ctas = ["Learn More", "Contact Us", "Visit Website"];
  if (campaignData.callToAction) {
    if (Array.isArray(campaignData.callToAction)) {
      ctas = campaignData.callToAction.slice(0, 3);
    } else {
      ctas = campaignData.callToAction.split(',').slice(0, 3).map(cta => cta.trim());
    }
  }

  // Create five fallback Microsoft ad variations
  return [
    {
      headline1: `${companyName}`,
      headline2: `Quality ${keywords[0] || 'Services'}`,
      headline3: `${ctas[0] || 'Learn More'}`,
      description1: `Discover what ${companyName} offers.`,
      description2: `Professional services you can trust.`,
      headlines: [
        `${companyName}`,
        `Quality ${keywords[0] || 'Services'}`,
        `${ctas[0] || 'Learn More'}`
      ],
      descriptions: [
        `Discover what ${companyName} offers.`,
        `Professional services you can trust.`
      ],
      path1: "services",
      path2: "quality"
    },
    {
      headline1: `${keywords[0] || 'Professional'} Solutions`,
      headline2: `By ${companyName}`,
      headline3: `${ctas[1] || 'Contact Us'}`,
      description1: `${description.substring(0, 80)}...`,
      description2: `Get started today with our expert team.`,
      headlines: [
        `${keywords[0] || 'Professional'} Solutions`,
        `By ${companyName}`,
        `${ctas[1] || 'Contact Us'}`
      ],
      descriptions: [
        `${description.substring(0, 80)}...`,
        `Get started today with our expert team.`
      ],
      path1: "solutions",
      path2: "experts"
    },
    {
      headline1: `Top Rated ${keywords[1] || 'Professional'}`,
      headline2: `${companyName} Services`,
      headline3: `${ctas[2] || 'Visit Website'}`,
      description1: `Reliable solutions for your needs.`,
      description2: `Trusted by customers for years.`,
      headlines: [
        `Top Rated ${keywords[1] || 'Professional'}`,
        `${companyName} Services`,
        `${ctas[2] || 'Visit Website'}`
      ],
      descriptions: [
        `Reliable solutions for your needs.`,
        `Trusted by customers for years.`
      ],
      path1: "trusted",
      path2: "reliable"
    },
    {
      headline1: `${keywords[2] || 'Expert'} Services`,
      headline2: `${companyName} Solutions`,
      headline3: `Discover More Today`,
      description1: `Professional team ready to help you.`,
      description2: `Quality results guaranteed.`,
      headlines: [
        `${keywords[2] || 'Expert'} Services`,
        `${companyName} Solutions`,
        `Discover More Today`
      ],
      descriptions: [
        `Professional team ready to help you.`,
        `Quality results guaranteed.`
      ],
      path1: "expert",
      path2: "services"
    },
    {
      headline1: `${companyName} Specialists`,
      headline2: `${keywords[0] || 'Professional'} Solutions`,
      headline3: `Contact Us Today`,
      description1: `Find the right solution for your needs.`,
      description2: `Expert team waiting to assist you.`,
      headlines: [
        `${companyName} Specialists`,
        `${keywords[0] || 'Professional'} Solutions`,
        `Contact Us Today`
      ],
      descriptions: [
        `Find the right solution for your needs.`,
        `Expert team waiting to assist you.`
      ],
      path1: "specialist",
      path2: "solutions"
    }
  ];
}
