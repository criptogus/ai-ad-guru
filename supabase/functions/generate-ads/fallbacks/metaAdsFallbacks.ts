
import { WebsiteAnalysisResult } from "../types.ts";

export function generateFallbackMetaAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Your Company';
  const industry = campaignData.industry || 'professional services';
  const targetAudience = campaignData.targetAudience || 'potential customers';
  const description = campaignData.businessDescription || campaignData.companyDescription || `${companyName} provides quality services`;
  const objective = campaignData.objective || 'awareness';

  // Create USP text from array or default
  const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints 
    : (typeof campaignData.uniqueSellingPoints === 'string' 
        ? [campaignData.uniqueSellingPoints] 
        : ['Quality service', 'Professional team']);

  // Create CTAs from array or default
  const callToActions = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction 
    : (typeof campaignData.callToAction === 'string' 
        ? [campaignData.callToAction] 
        : ['Learn More', 'Discover Today', 'Contact Us']);

  // Use brand tone or default
  const brandTone = campaignData.brandTone || 'professional';

  return [
    {
      headline: `${companyName} - Premium ${industry} Solutions`,
      primaryText: `Discover how our innovative ${industry} solutions can help ${targetAudience} achieve their goals. ${uniqueSellingPoints[0] || 'Quality service guaranteed'}. #${industry.replace(/\s+/g, '')} #quality`,
      description: `${uniqueSellingPoints[0] || 'Professional solutions'} for ${targetAudience}`,
      image_prompt: `Professional lifestyle image for ${companyName} in ${industry} field, showing ${targetAudience}, high-quality commercial photography with ${brandTone} tone, elegant lighting`,
      format: "feed"
    },
    {
      headline: `Transform Your ${industry} Experience`,
      primaryText: `${companyName} helps ${targetAudience} ${objective === 'conversion' ? 'achieve results' : objective === 'consideration' ? 'find solutions' : 'discover possibilities'} with our ${uniqueSellingPoints[0] || 'premium'} ${industry} services. ${callToActions[0] || 'Contact us today'}! #innovation #${industry.replace(/\s+/g, '')}`,
      description: `${description.substring(0, 80)}...`,
      image_prompt: `Modern ${industry} setting with people representing ${targetAudience}, premium photography style with soft lighting and professional environment, no text overlay`,
      format: "feed"
    },
    {
      headline: `${industry} Excellence for ${targetAudience}`,
      primaryText: `At ${companyName}, we understand what ${targetAudience} need. That's why our ${industry} solutions emphasize ${uniqueSellingPoints[0] || 'quality'} and ${uniqueSellingPoints[1] || 'reliability'}. ${callToActions[0] || 'Start today'}!`,
      description: `Trusted by clients in ${industry}`,
      image_prompt: `Professional ${industry} environment showing benefits for ${targetAudience}, clean modern aesthetic with ${brandTone} atmosphere, commercial photography style`,
      format: "feed"
    },
    {
      headline: `The ${industry} Solution You've Been Looking For`,
      primaryText: `${companyName} delivers ${uniqueSellingPoints[0] || 'exceptional'} ${industry} solutions designed specifically for ${targetAudience}. Experience the difference today! #${industry.replace(/\s+/g, '')} #solutions`,
      description: `${uniqueSellingPoints[1] || 'Innovative approach'} to ${industry}`,
      image_prompt: `Elegant product/service presentation for ${industry} company, showing benefits for ${targetAudience}, warm professional lighting, premium commercial photography style`,
      format: "feed"
    },
    {
      headline: `${objective === 'conversion' ? 'Act Now' : objective === 'consideration' ? 'Discover Why' : 'Introducing'}: ${companyName}`,
      primaryText: `Looking for ${industry} solutions that truly deliver? ${companyName} provides ${targetAudience} with ${uniqueSellingPoints[0] || 'top-quality'} service and ${uniqueSellingPoints[1] || 'outstanding results'}. ${callToActions[0] || 'Learn more'} about our approach.`,
      description: `${description.substring(0, 80)}...`,
      image_prompt: `Professional team in ${industry} setting, diverse group representing service to ${targetAudience}, polished commercial photography with ${brandTone} aesthetic`,
      format: "feed"
    }
  ];
}

export function generateFallbackLinkedInAds(campaignData: WebsiteAnalysisResult) {
  const companyName = campaignData.companyName || 'Your Company';
  const industry = campaignData.industry || 'professional services';
  const targetAudience = campaignData.targetAudience || 'businesses and professionals';
  const description = campaignData.businessDescription || campaignData.companyDescription || `${companyName} provides quality B2B services`;
  const objective = campaignData.objective || 'awareness';

  // Create USP text from array or default
  const uniqueSellingPoints = Array.isArray(campaignData.uniqueSellingPoints) 
    ? campaignData.uniqueSellingPoints 
    : (typeof campaignData.uniqueSellingPoints === 'string' 
        ? [campaignData.uniqueSellingPoints] 
        : ['Professional expertise', 'Industry leadership']);

  // Create CTAs from array or default
  const callToActions = Array.isArray(campaignData.callToAction) 
    ? campaignData.callToAction 
    : (typeof campaignData.callToAction === 'string' 
        ? [campaignData.callToAction] 
        : ['Connect today', 'Schedule a consultation', 'Learn more']);

  // Use brand tone or default
  const brandTone = campaignData.brandTone || 'professional';

  return [
    {
      headline: `${companyName}: Leading ${industry} Solutions for ${targetAudience}`,
      primaryText: `At ${companyName}, we help ${targetAudience} achieve their business objectives through our comprehensive ${industry} solutions. Our approach emphasizes ${uniqueSellingPoints[0] || 'quality and reliability'} to ensure your success in today's competitive market.`,
      description: `${uniqueSellingPoints[0] || 'Professional solutions'} for modern businesses`,
      image_prompt: `Professional corporate ${industry} environment with business professionals in discussion, premium photography with subtle blue lighting, business attire, clean modern office setting`,
      format: "feed"
    },
    {
      headline: `Transform Your ${industry} Strategy with ${companyName}`,
      primaryText: `${companyName} offers ${targetAudience} a strategic advantage through our innovative ${industry} services. Our team of experts brings ${uniqueSellingPoints[0] || 'years of experience'} and ${uniqueSellingPoints[1] || 'proven methodologies'} to every client engagement. ${callToActions[0] || 'Connect with us'} to learn how we can support your business objectives.`,
      description: `${description.substring(0, 80)}...`,
      image_prompt: `Business professionals reviewing data on screens and charts, ${industry} setting, professional attire, modern corporate environment with blue accents, premium business photography`,
      format: "feed"
    },
    {
      headline: `${industry} Excellence for Modern Businesses`,
      primaryText: `${companyName} delivers ${uniqueSellingPoints[0] || 'exceptional'} ${industry} solutions that help ${targetAudience} ${objective === 'conversion' ? 'achieve measurable results' : objective === 'consideration' ? 'optimize their operations' : 'stay ahead of trends'}. Our comprehensive approach addresses the unique challenges facing your organization.`,
      description: `Trusted by leading organizations in ${industry}`,
      image_prompt: `Corporate meeting between diverse business professionals discussing strategy, modern conference room, professional attire, clean business setting with natural light, ${brandTone} atmosphere`,
      format: "feed"
    },
    {
      headline: `${objective === 'conversion' ? 'Drive Results' : objective === 'consideration' ? 'Optimize Your Approach' : 'Discover Possibilities'} with ${companyName}`,
      primaryText: `${companyName} has helped numerous ${targetAudience} achieve their ${industry} goals through our ${uniqueSellingPoints[0] || 'strategic approach'} and ${uniqueSellingPoints[1] || 'dedicated expertise'}. Our comprehensive solutions address the complex challenges facing modern businesses. ${callToActions[0] || 'Contact our team'} to discuss your specific needs.`,
      description: `${uniqueSellingPoints[1] || 'Strategic solutions'} for ${targetAudience}`,
      image_prompt: `Professional team of business experts in discussion, modern corporate office with glass walls and city view, business professional attire, laptop and charts visible, premium corporate photography`,
      format: "feed"
    },
    {
      headline: `The Strategic Partner for Your ${industry} Needs`,
      primaryText: `${companyName} provides ${targetAudience} with the strategic ${industry} support they need in today's competitive landscape. Our approach combines ${uniqueSellingPoints[0] || 'industry expertise'} with ${uniqueSellingPoints[1] || 'innovative methodologies'} to deliver meaningful outcomes for our clients. ${callToActions[0] || 'Learn more'} about our professional services.`,
      description: `${description.substring(0, 80)}...`,
      image_prompt: `Business professional presenting to colleagues in modern boardroom, corporate attire, clean business environment with subtle technology elements, professional lighting, ${brandTone} corporate aesthetic`,
      format: "feed"
    }
  ];
}
