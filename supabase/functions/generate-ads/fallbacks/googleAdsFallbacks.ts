
import { GoogleAd } from "../types.ts";
import { WebsiteAnalysisResult } from "../types.ts";

/**
 * Generates fallback Google ads when AI generation fails
 */
export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult): GoogleAd[] {
  const { 
    companyName = "Your Company", 
    businessDescription = "", 
    callToAction = ["Learn More"]
  } = campaignData;
  
  // Extract basic info for fallback content
  const description = businessDescription 
    ? businessDescription.substring(0, 80) 
    : `Quality products and services from ${companyName}`;
  
  const cta = Array.isArray(callToAction) && callToAction.length > 0 
    ? callToAction[0] 
    : "Check Out Our Offers";

  // Create basic fallback ads
  return [
    {
      headlines: [
        `${companyName}`,
        "Top Quality Service",
        "Shop Now & Save"
      ],
      descriptions: [
        `${description.substring(0, 80)}`,
        `${cta}. Satisfaction guaranteed!`
      ]
    },
    {
      headlines: [
        `Discover ${companyName}`,
        "Premium Solutions",
        "Limited Time Offer"
      ],
      descriptions: [
        "Quality products designed to meet your needs. Best-in-class service.",
        "Visit our website today for exclusive deals!"
      ]
    },
    {
      headlines: [
        "Best Quality Guaranteed",
        `${companyName} Services`,
        "Trusted by Customers"
      ],
      descriptions: [
        "We provide exceptional products with outstanding customer service.",
        "Contact us today to learn more about our offers."
      ]
    },
    {
      headlines: [
        "Exclusive Deals",
        `${companyName} - Best Choice`,
        "Save Today"
      ],
      descriptions: [
        "Find the perfect solution for your needs. Quality guaranteed.",
        "Limited time offer. Don't miss out!"
      ]
    },
    {
      headlines: [
        `Why Choose ${companyName}?`,
        "Superior Quality",
        "Customer Satisfaction"
      ],
      descriptions: [
        "We deliver excellence in everything we do. Trusted by thousands.",
        "Visit our website to discover our full range of services."
      ]
    }
  ];
}

/**
 * Generates fallback Microsoft ads when AI generation fails
 */
export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult): GoogleAd[] {
  const { 
    companyName = "Your Company", 
    businessDescription = "", 
    callToAction = ["Learn More"]
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
