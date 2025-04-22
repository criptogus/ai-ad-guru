
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

// Combine Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text && text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

// Format date 
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Normalize Google Ad data to ensure consistent structure
export function normalizeGoogleAd(ad: any): GoogleAd {
  return {
    headline1: ad.headline_1 || ad.headline1 || '',
    headline2: ad.headline_2 || ad.headline2 || '',
    headline3: ad.headline_3 || ad.headline3 || 'Learn More',
    description1: ad.description_1 || ad.description1 || '',
    description2: ad.description_2 || ad.description2 || '',
    displayPath: ad.display_url || ad.displayPath || '',
    path1: ad.path1 || 'services',
    path2: ad.path2 || 'info',
    siteLinks: ad.siteLinks || []
  };
}

// Normalize Meta Ad data to ensure consistent structure
export function normalizeMetaAd(ad: any): MetaAd {
  return {
    headline: ad.headline || (ad.text?.split('\n')[0]) || 'Discover More',
    primaryText: ad.text || ad.primaryText || '',
    description: ad.description || '',
    imagePrompt: ad.image_prompt || ad.imagePrompt || 'Professional ad image',
    format: ad.format === 'square' ? 'feed' : (ad.format || 'feed') // Convert 'square' to 'feed'
  };
}

// Extract domain from URL
export function extractDomain(url: string): string {
  if (!url) return '';
  
  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return hostname.replace('www.', '');
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url;
  }
}

// Alias for extractDomain for backward compatibility
export const getDomain = extractDomain;

// Generate initials from a name
export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
