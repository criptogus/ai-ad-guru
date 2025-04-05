
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    // If URL parsing fails, just return the string
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

// Helper function to ensure GoogleAd has headlines and descriptions arrays
export function normalizeGoogleAd(ad: any): any {
  const normalized = { ...ad };
  
  if (!normalized.headlines) {
    normalized.headlines = [
      normalized.headline1 || '',
      normalized.headline2 || '',
      normalized.headline3 || ''
    ];
  }
  
  if (!normalized.descriptions) {
    normalized.descriptions = [
      normalized.description1 || '',
      normalized.description2 || ''
    ];
  }
  
  // Ensure siteLinks has the required link property
  if (normalized.siteLinks && Array.isArray(normalized.siteLinks)) {
    normalized.siteLinks = normalized.siteLinks.map((siteLink: any) => {
      if (!siteLink.link) {
        return { ...siteLink, link: '#' };
      }
      return siteLink;
    });
  } else {
    normalized.siteLinks = [];
  }
  
  return normalized;
}

// Helper function to ensure MetaAd has format and hashtags properties
export function normalizeMetaAd(ad: any): any {
  const normalized = { ...ad };
  
  if (normalized.format === undefined) {
    normalized.format = "feed";
  }
  
  if (normalized.hashtags === undefined) {
    normalized.hashtags = [];
  }
  
  return normalized;
}
