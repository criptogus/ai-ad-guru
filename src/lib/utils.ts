
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extract domain from URL
export function getDomain(url?: string): string {
  if (!url) return 'example.com';
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    // If URL is invalid, return the original string or a default
    return url.includes('.') ? url : 'example.com';
  }
}

// Normalize GoogleAd to ensure it has headlines and descriptions arrays
export function normalizeGoogleAd(ad: GoogleAd): GoogleAd {
  if (!ad) return ad;
  
  const normalizedAd: GoogleAd = { ...ad };
  
  // Ensure headlines array exists
  if (!normalizedAd.headlines) {
    normalizedAd.headlines = [
      normalizedAd.headline1 || '',
      normalizedAd.headline2 || '',
      normalizedAd.headline3 || ''
    ];
  }
  
  // Ensure descriptions array exists
  if (!normalizedAd.descriptions) {
    normalizedAd.descriptions = [
      normalizedAd.description1 || '',
      normalizedAd.description2 || ''
    ];
  }
  
  // Ensure siteLinks have link property
  if (normalizedAd.siteLinks) {
    normalizedAd.siteLinks = normalizedAd.siteLinks.map(link => {
      if (!link.link) {
        return {
          ...link,
          link: '#'  // Add default link if missing
        };
      }
      return link;
    });
  }
  
  return normalizedAd;
}

// Normalize MetaAd to ensure it has format and hashtags properties
export function normalizeMetaAd(ad: MetaAd): MetaAd {
  if (!ad) return ad;
  
  const normalizedAd: MetaAd = { ...ad };
  
  // Ensure format exists with a default value
  if (!normalizedAd.format) {
    normalizedAd.format = "feed";
  }
  
  // Ensure hashtags exists
  if (!normalizedAd.hashtags) {
    normalizedAd.hashtags = [];
  }
  
  return normalizedAd;
}
