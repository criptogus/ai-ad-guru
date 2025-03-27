
/**
 * Ad Generation Service
 * Central service for generating ads across platforms
 */

import { errorLogger } from '@/services/libs/error-handling';
import { generateGoogleAds } from '@/services/ads/google/googleAdGenerator';
import { generateMetaAds } from '@/services/ads/meta/metaAdGenerator';
import { generateLinkedInAds } from '@/services/ads/linkedin/linkedInAdGenerator';
import { generateMicrosoftAds } from '@/services/ads/microsoft/microsoftAdGenerator';

export interface AdGenerationParams {
  platform: 'google' | 'meta' | 'linkedin' | 'microsoft';
  companyName: string;
  industry: string;
  productDescription: string;
  targetAudience: string;
  keywords: string[];
  callToAction: string;
  mindTrigger?: string;
  websiteUrl?: string;
}

/**
 * Generate ads for a specific platform
 */
export const generateAds = async (params: AdGenerationParams): Promise<any[]> => {
  try {
    switch (params.platform) {
      case 'google':
        return await generateGoogleAds({
          companyName: params.companyName,
          industry: params.industry,
          productDescription: params.productDescription,
          targetAudience: params.targetAudience,
          keywords: params.keywords,
          callToAction: params.callToAction,
          mindTrigger: params.mindTrigger,
          finalUrl: params.websiteUrl
        });
      
      case 'meta':
        return await generateMetaAds({
          companyName: params.companyName,
          industry: params.industry,
          productDescription: params.productDescription,
          targetAudience: params.targetAudience,
          keywords: params.keywords,
          callToAction: params.callToAction,
          mindTrigger: params.mindTrigger
        });
      
      case 'linkedin':
        return await generateLinkedInAds({
          companyName: params.companyName,
          industry: params.industry,
          productDescription: params.productDescription,
          targetAudience: params.targetAudience,
          keywords: params.keywords,
          callToAction: params.callToAction,
          mindTrigger: params.mindTrigger
        });
      
      case 'microsoft':
        return await generateMicrosoftAds({
          companyName: params.companyName,
          industry: params.industry,
          productDescription: params.productDescription,
          targetAudience: params.targetAudience,
          keywords: params.keywords,
          callToAction: params.callToAction,
          mindTrigger: params.mindTrigger
        });
      
      default:
        throw new Error(`Unsupported platform: ${params.platform}`);
    }
  } catch (error) {
    errorLogger.logError(error, 'generateAds');
    return [];
  }
};
