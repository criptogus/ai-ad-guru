
import { MetaAd } from "./types.ts";

/**
 * Generates fallback LinkedIn Ads when the AI generation fails
 * @param campaignData The campaign data used for generating the ads
 * @returns An array of LinkedInAd objects (using MetaAd interface for compatibility)
 */
export function generateFallbackLinkedInAds(campaignData: any): MetaAd[] {
  const companyName = campaignData.companyName || "Our Company";
  const description = campaignData.businessDescription || "Our services";
  const targetAudience = campaignData.targetAudience || "professionals";
  
  // Generate 3 fallback LinkedIn ads
  return [
    {
      headline: `Grow Your Business with ${companyName}`,
      primaryText: `Attention ${targetAudience}: ${description} Our proven approach has helped companies like yours achieve measurable results. Learn how we can support your professional growth.`,
      description: "Learn More",
      imagePrompt: `A professional business setting showing ${companyName}'s solutions in action, with corporate professionals in a meeting room environment discussing growth strategies.`,
      imageUrl: "https://placehold.co/1024x1024/0077B5/FFFFFF/png?text=LinkedIn+Ad"
    },
    {
      headline: `${companyName}: Industry Leaders`,
      primaryText: `Want to stay ahead of the competition? Our team of experts provides cutting-edge solutions for ${targetAudience}. Discover why leading companies trust us for their business needs.`,
      description: "Connect Now",
      imagePrompt: `A professional image showing thought leadership in action - perhaps a keynote speaker at a conference with ${companyName} branding, projecting authority and expertise.`,
      imageUrl: "https://placehold.co/1024x1024/0077B5/FFFFFF/png?text=LinkedIn+Ad"
    },
    {
      headline: `Unlock New Opportunities with ${companyName}`,
      primaryText: `Looking to enhance your professional capabilities? ${description} Join thousands of ${targetAudience} who have already transformed their approach with our proven solutions.`,
      description: "Request Demo",
      imagePrompt: `A professional image showing data visualization or business growth charts with professionals analyzing results, conveying success and opportunity.`,
      imageUrl: "https://placehold.co/1024x1024/0077B5/FFFFFF/png?text=LinkedIn+Ad"
    }
  ];
}
