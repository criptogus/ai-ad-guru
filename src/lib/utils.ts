
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url?: string): string {
  if (!url) return 'example.com';
  try {
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  } catch (error) {
    return 'example.com';
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Normalize GoogleAd objects to ensure they have headlines and descriptions arrays
export function normalizeGoogleAd(ad: GoogleAd): GoogleAd {
  if (!ad) return ad;
  
  const normalizedAd = { ...ad };
  
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
  
  return normalizedAd;
}

// Normalize MetaAd objects to ensure they have format and hashtags
export function normalizeMetaAd(ad: MetaAd): MetaAd {
  if (!ad) return ad;
  
  const normalizedAd = { ...ad };
  
  // Ensure format exists
  if (!normalizedAd.format) {
    normalizedAd.format = "feed";
  }
  
  // Ensure hashtags exist
  if (!normalizedAd.hashtags) {
    normalizedAd.hashtags = [];
  }
  
  return normalizedAd;
}
