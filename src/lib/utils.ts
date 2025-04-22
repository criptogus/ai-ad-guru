
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for conditionally joining CSS class names
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Get domain from website URL
export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
}

// Normalize Google Ad to ensure all required fields are present
export function normalizeGoogleAd(ad: Partial<GoogleAd>): GoogleAd {
  return {
    headline1: ad.headline1 || 'Your Headline',
    headline2: ad.headline2 || 'Secondary Headline',
    headline3: ad.headline3 || 'Learn More',
    description1: ad.description1 || 'Description line 1 with details about your product or service.',
    description2: ad.description2 || 'Additional details about features or benefits.',
    path1: ad.path1 || 'path',
    path2: ad.path2 || 'example',
    displayPath: ad.displayPath || '',
    finalUrl: ad.finalUrl || '',
    siteLinks: ad.siteLinks || [],
    // Ensure headlines array is populated
    headlines: ad.headlines || [ad.headline1 || 'Your Headline', ad.headline2 || 'Secondary Headline', ad.headline3 || 'Learn More'],
    // Ensure descriptions array is populated
    descriptions: ad.descriptions || [ad.description1 || 'Description line 1 with details about your product or service.', ad.description2 || 'Additional details about features or benefits.']
  };
}

// Normalize Meta Ad to ensure all required fields are present
export function normalizeMetaAd(ad: Partial<MetaAd>): MetaAd {
  return {
    headline: ad.headline || 'Discover Our Products',
    primaryText: ad.primaryText || 'Check out our latest offerings designed for you.',
    description: ad.description || '',
    imagePrompt: ad.imagePrompt || 'Professional product image with clean background',
    imageUrl: ad.imageUrl || undefined,
    format: ad.format || 'feed',
    hashtags: ad.hashtags || [],
    callToAction: ad.callToAction || ''
  };
}
