
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to extract domain from a URL
export function getDomain(url: string): string {
  try {
    if (!url) return 'example.com';
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return hostname.replace('www.', '');
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url || 'example.com';
  }
}

// Function to normalize Google Ad data format
export function normalizeGoogleAd(ad: any): GoogleAd {
  // Handle mismatch between API response format and our interface
  return {
    headline1: ad.headline1 || ad.headline_1 || '',
    headline2: ad.headline2 || ad.headline_2 || '',
    headline3: ad.headline3 || ad.headline_3 || 'Learn More',
    description1: ad.description1 || ad.description_1 || '',
    description2: ad.description2 || ad.description_2 || '',
    displayPath: ad.displayPath || ad.display_url || '',
    path1: ad.path1 || 'services',
    path2: ad.path2 || 'info',
    siteLinks: ad.siteLinks || [],
    
    // Add headlines and descriptions arrays if they don't exist
    headlines: ad.headlines || [ad.headline1 || ad.headline_1 || '', ad.headline2 || ad.headline_2 || '', ad.headline3 || ad.headline_3 || ''],
    descriptions: ad.descriptions || [ad.description1 || ad.description_1 || '', ad.description2 || ad.description_2 || '']
  };
}
