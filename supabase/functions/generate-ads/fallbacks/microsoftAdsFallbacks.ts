
import { GoogleAd } from "../types.ts";
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Microsoft ads when AI generation fails
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult): GoogleAd[] {
  const { 
    companyName, 
    businessDescription, 
    callToAction
  } = campaignData;
  
  // Extract basic info for fallback content
  const description = businessDescription 
    ? businessDescription.substring(0, 80) 
    : `Quality products and services from ${companyName}`;
  
  const cta = Array.isArray(callToAction) && callToAction.length > 0 
    ? callToAction[0] 
    : "Explore Our Solutions";

  // Create basic fallback ads for Microsoft
  return [
    {
      headlines: [
        `${companyName} Solutions`,
        "Professional Service",
        "Expert Assistance"
      ],
      descriptions: [
        `${description.substring(0, 80)}`,
        `${cta}. Professional support available.`
      ]
    },
    {
      headlines: [
        `${companyName} - Excellence`,
        "Trusted Provider",
        "Professional Service"
      ],
      descriptions: [
        "Industry-leading solutions designed for professionals. Expert support.",
        "Contact us today for a personalized consultation."
      ]
    },
    {
      headlines: [
        "Business Solutions",
        `${companyName} Services`,
        "Enterprise Quality"
      ],
      descriptions: [
        "Professional-grade products designed for business efficiency.",
        "Schedule a demo to see how we can help your business."
      ]
    },
    {
      headlines: [
        "Professional Services",
        `${companyName} Expertise`,
        "Business Solutions"
      ],
      descriptions: [
        "Tailored solutions for modern businesses. Increase productivity.",
        "Contact our team to discuss your requirements."
      ]
    },
    {
      headlines: [
        `${companyName} for Business`,
        "Enterprise Solutions",
        "Professional Support"
      ],
      descriptions: [
        "Comprehensive business solutions with outstanding support.",
        "Request a quote today for your organization's needs."
      ]
    }
  ];
}
