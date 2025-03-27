
/**
 * Ad Generation Service
 * Central service for generating ads across different platforms
 */

import { generateGoogleAds } from '@/services/ads/google/googleAdGenerator';
import { generateMetaAds } from '@/services/ads/meta/metaAdGenerator';
import { generateLinkedInAds } from '@/services/ads/linkedin/linkedInAdGenerator';
import { generateMicrosoftAds } from '@/services/ads/microsoft/microsoftAdGenerator';
import { errorLogger } from '@/services/libs/error-handling';

/**
 * Generate ads for a specific platform
 */
export const generateAdsForPlatform = async (
  platform: 'google' | 'meta' | 'linkedin' | 'microsoft',
  data: any
) => {
  try {
    switch (platform) {
      case 'google':
        return await generateGoogleAds(data);
      case 'meta':
        return await generateMetaAds(data);
      case 'linkedin':
        return await generateLinkedInAds(data);
      case 'microsoft':
        return await generateMicrosoftAds(data);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    errorLogger.logError(error, 'generateAdsForPlatform');
    throw error;
  }
};

/**
 * Generate ads for multiple platforms
 */
export const generateMultiPlatformAds = async (
  platforms: Array<'google' | 'meta' | 'linkedin' | 'microsoft'>,
  data: any
) => {
  try {
    const results: Record<string, any> = {};
    
    for (const platform of platforms) {
      results[platform] = await generateAdsForPlatform(platform, data);
    }
    
    return results;
  } catch (error) {
    errorLogger.logError(error, 'generateMultiPlatformAds');
    throw error;
  }
};
