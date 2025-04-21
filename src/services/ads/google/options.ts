
/**
 * Google Ads Options
 * Contains utility functions to generate headline and description options for Google Ads
 */

import { errorLogger } from '@/services/libs/error-handling';

/**
 * Get headline options for Google Ads based on provided parameters
 */
export const getHeadlineOptions = (params: any = {}): string[] => {
  try {
    const { companyName, industry, callToAction } = params;
    
    // Default options if specific parameters aren't provided
    const defaultHeadlines = [
      "Quality Services",
      "Professional Solutions",
      "Expert Assistance",
      "Top-Rated Service",
      "Premium Solutions"
    ];
    
    // Dynamic headlines based on provided parameters
    const dynamicHeadlines: string[] = [];
    
    if (companyName) {
      dynamicHeadlines.push(
        `${companyName} - Professional Services`,
        `Discover ${companyName}`,
        `Why Choose ${companyName}?`
      );
    }
    
    if (industry) {
      dynamicHeadlines.push(
        `Leading ${industry} Services`,
        `${industry} Experts`,
        `Professional ${industry} Solutions`
      );
    }
    
    if (callToAction) {
      dynamicHeadlines.push(
        `${callToAction}`,
        `${callToAction} Today`
      );
    }
    
    // Return dynamic headlines first, then default ones, up to 15 options
    return [...new Set([...dynamicHeadlines, ...defaultHeadlines])].slice(0, 15);
  } catch (error) {
    console.error("Error generating headline options:", error);
    return [
      "Quality Services",
      "Professional Solutions",
      "Expert Assistance",
      "Top-Rated Service",
      "Premium Solutions"
    ];
  }
};

/**
 * Get description options for Google Ads based on provided parameters
 */
export const getDescriptionOptions = (params: any = {}): string[] => {
  try {
    const { companyName, targetAudience, callToAction, businessDescription } = params;
    
    // Default options if specific parameters aren't provided
    const defaultDescriptions = [
      "We provide professional services tailored to your needs. Contact us today for more information.",
      "Quality solutions for your business. Get started with a free consultation.",
      "Expert team ready to help you succeed. Call us today to learn more.",
      "Trusted by thousands of customers. Find out why we're the top choice.",
      "Affordable and reliable services. Contact us now for a custom quote."
    ];
    
    // Dynamic descriptions based on provided parameters
    const dynamicDescriptions: string[] = [];
    
    if (businessDescription) {
      dynamicDescriptions.push(
        `${businessDescription.substring(0, 80)}${businessDescription.length > 80 ? '...' : ''}`,
        `${businessDescription.substring(0, 70)}${businessDescription.length > 70 ? '...' : ''} Contact us today!`
      );
    }
    
    if (companyName && targetAudience) {
      dynamicDescriptions.push(
        `${companyName} helps ${targetAudience} achieve better results. Contact us to learn more.`,
        `Designed for ${targetAudience}. ${companyName} delivers quality service every time.`
      );
    }
    
    if (callToAction) {
      dynamicDescriptions.push(
        `${callToAction}. Our expert team is ready to assist you.`,
        `${callToAction}. Trusted by thousands of satisfied customers.`
      );
    }
    
    // Return dynamic descriptions first, then default ones, up to 4 options
    return [...new Set([...dynamicDescriptions, ...defaultDescriptions])].slice(0, 4);
  } catch (error) {
    console.error("Error generating description options:", error);
    return [
      "We provide professional services tailored to your needs. Contact us today for more information.",
      "Quality solutions for your business. Get started with a free consultation."
    ];
  }
};
