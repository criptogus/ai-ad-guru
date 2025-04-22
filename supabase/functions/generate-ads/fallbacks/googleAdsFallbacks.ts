
import { WebsiteAnalysisResult } from "../types.ts";

export function generateFallbackGoogleAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Your Company';
  const industry = campaignData.industry || 'professional services';
  const targetAudience = campaignData.targetAudience || 'potential customers';
  const objective = campaignData.objective || 'awareness';
  const websiteUrl = campaignData.websiteUrl || 'example.com';
  
  // Create display URL
  const displayUrl = websiteUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  
  // Normalize uniqueSellingPoints to array
  const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints 
    : (typeof campaignData.uniqueSellingPoints === 'string' 
        ? [campaignData.uniqueSellingPoints] 
        : ['Quality service', 'Expert team']);
    
  // Normalize callToAction to array  
  const callToActions = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction 
    : (typeof campaignData.callToAction === 'string' 
        ? [campaignData.callToAction] 
        : ['Learn More', 'Contact Us', 'Get Started']);

  return [
    {
      headline_1: `${companyName} ${industry}`,
      headline_2: `Solutions for ${targetAudience}`,
      headline_3: objective === 'conversion' ? 'Buy Now' : (objective === 'consideration' ? 'Learn More' : 'Discover Today'),
      description_1: `Top-rated ${industry} services designed specifically for ${targetAudience}. ${uniqueSellingPoints[0] || 'Quality guaranteed'}.`,
      description_2: `${uniqueSellingPoints[1] || 'Professional team'} ready to help. ${callToActions[0] || 'Contact us'} today for a ${objective === 'conversion' ? 'quote' : 'consultation'}.`,
      display_url: displayUrl
    },
    {
      headline_1: `${industry} Experts | ${companyName}`,
      headline_2: `Trusted by ${targetAudience}`,
      headline_3: callToActions[0] || 'Contact Us Today',
      description_1: `Award-winning ${industry} solutions with ${uniqueSellingPoints[0] || 'proven results'}. Helping ${targetAudience} since 2010.`,
      description_2: `${uniqueSellingPoints[1] || 'Customized approach'} for your needs. Free ${objective === 'conversion' ? 'quote' : 'consultation'} available.`,
      display_url: `${displayUrl}/services`
    },
    {
      headline_1: `#1 ${industry} Provider`,
      headline_2: `Solutions for ${targetAudience}`,
      headline_3: objective === 'conversion' ? 'Get a Quote Today' : (objective === 'consideration' ? 'See Our Approach' : 'Learn How We Help'),
      description_1: `${companyName} delivers ${uniqueSellingPoints[0] || 'premium'} ${industry} services tailored for ${targetAudience}.`,
      description_2: `${uniqueSellingPoints[1] || 'Expert team'} with years of experience. ${callToActions[1] || 'Schedule a call'} now.`,
      display_url: `${displayUrl}/solutions`
    },
    {
      headline_1: `${companyName} - ${objective === 'conversion' ? 'Save Today' : (objective === 'consideration' ? 'Compare Options' : 'Discover Solutions')}`,
      headline_2: `Top-Rated ${industry} Services`,
      headline_3: `Perfect for ${targetAudience}`,
      description_1: `Looking for quality ${industry} services? ${companyName} provides ${uniqueSellingPoints[0] || 'exceptional'} solutions.`,
      description_2: `${uniqueSellingPoints[1] || 'Customized approach'} for every client. ${callToActions[0] || 'Visit our site'} to learn more.`,
      display_url: displayUrl
    },
    {
      headline_1: `${industry} Solutions | ${companyName}`,
      headline_2: `Designed for ${targetAudience}`,
      headline_3: callToActions[0] || 'Contact Us Today',
      description_1: `Get ${uniqueSellingPoints[0] || 'professional'} ${industry} services from ${companyName}. Trusted by clients nationwide.`,
      description_2: `${uniqueSellingPoints[1] || 'Affordable options'} available. ${objective === 'conversion' ? 'Limited time offer.' : 'Free resources available.'}`,
      display_url: `${displayUrl}/about`
    }
  ];
}

export function generateFallbackMicrosoftAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Your Company';
  const industry = campaignData.industry || 'professional services';
  const targetAudience = campaignData.targetAudience || 'potential customers';
  const objective = campaignData.objective || 'awareness';
  const websiteUrl = campaignData.websiteUrl || 'example.com';
  
  // Create display URL
  const displayUrl = websiteUrl.replace(/^https?:\/\//i, '').replace(/^www\./i, '');
  
  // Normalize uniqueSellingPoints to array
  const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints 
    : (typeof campaignData.uniqueSellingPoints === 'string' 
        ? [campaignData.uniqueSellingPoints] 
        : ['Quality service', 'Expert team']);
    
  // Normalize callToAction to array  
  const callToActions = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction 
    : (typeof campaignData.callToAction === 'string' 
        ? [campaignData.callToAction] 
        : ['Learn More', 'Contact Us', 'Get Started']);

  return [
    {
      headline_1: `${companyName} - ${industry} Solutions`,
      headline_2: `Perfect for ${targetAudience}`,
      headline_3: objective === 'conversion' ? 'Special Offer Today' : (objective === 'consideration' ? 'See How We Help' : 'Discover More'),
      description_1: `Leading provider of ${industry} services with ${uniqueSellingPoints[0] || 'proven results'} for ${targetAudience}.`,
      description_2: `${uniqueSellingPoints[1] || 'Personalized service'} from experts in the field. ${callToActions[0] || 'Contact us'} today.`,
      display_url: displayUrl
    },
    {
      headline_1: `${industry} Services | ${companyName}`,
      headline_2: `Trusted by ${targetAudience}`,
      headline_3: callToActions[0] || 'Contact Us Today',
      description_1: `Find the right ${industry} solution with ${companyName}. ${uniqueSellingPoints[0] || 'Quality service'} guaranteed.`,
      description_2: `Serving ${targetAudience} with ${uniqueSellingPoints[1] || 'expertise and dedication'}. Free ${objective === 'conversion' ? 'quote' : 'consultation'}.`,
      display_url: `${displayUrl}/services`
    },
    {
      headline_1: `${companyName} ${industry} Services`,
      headline_2: `Designed for ${targetAudience}`,
      headline_3: objective === 'conversion' ? 'Request a Quote' : (objective === 'consideration' ? 'See Our Approach' : 'Learn More Today'),
      description_1: `${companyName} offers ${uniqueSellingPoints[0] || 'comprehensive'} ${industry} solutions that deliver real results.`,
      description_2: `Our ${uniqueSellingPoints[1] || 'experienced team'} is ready to help. ${callToActions[1] || 'Schedule a consultation'} now.`,
      display_url: `${displayUrl}/solutions`
    },
    {
      headline_1: `Premium ${industry} Solutions`,
      headline_2: `Ideal for ${targetAudience}`,
      headline_3: `By ${companyName} | ${callToActions[2] || 'Get Started'}`,
      description_1: `${companyName} provides ${uniqueSellingPoints[0] || 'top-quality'} ${industry} services tailored to your needs.`,
      description_2: `${uniqueSellingPoints[1] || 'Responsive support'} included. ${objective === 'conversion' ? 'Limited availability.' : 'Resources and guides available.'}`,
      display_url: displayUrl
    },
    {
      headline_1: `${industry} Experts at ${companyName}`,
      headline_2: `Solutions for ${targetAudience}`,
      headline_3: callToActions[0] || 'Learn More Today',
      description_1: `Looking for reliable ${industry} services? ${companyName} delivers ${uniqueSellingPoints[0] || 'exceptional results'}.`,
      description_2: `${uniqueSellingPoints[1] || 'Customer satisfaction'} is our priority. ${objective === 'conversion' ? 'Special offers available.' : 'Free resources available.'}`,
      display_url: `${displayUrl}/about`
    }
  ];
}
