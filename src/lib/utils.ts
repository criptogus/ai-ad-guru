
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getDomain(url: string): string {
  try {
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return new URL(url).hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
}

export function normalizeGoogleAd(ad: Partial<GoogleAd>): GoogleAd {
  // Convert individual headline fields to a headlines array if not present
  const headlines = ad.headlines || [
    ad.headline1 || '',
    ad.headline2 || '',
    ad.headline3 || ''
  ];

  // Convert individual description fields to a descriptions array if not present
  const descriptions = ad.descriptions || [
    ad.description1 || '',
    ad.description2 || ''
  ];

  // Ensure siteLinks have the required link property
  const siteLinks = ad.siteLinks?.map(site => ({
    title: site.title || '',
    description: site.description || '',
    link: site.link || '#'  // Provide a default link if missing
  })) || [];

  return {
    id: ad.id || crypto.randomUUID(),
    headline1: ad.headline1 || headlines[0] || '',
    headline2: ad.headline2 || headlines[1] || '',
    headline3: ad.headline3 || headlines[2] || '',
    description1: ad.description1 || descriptions[0] || '',
    description2: ad.description2 || descriptions[1] || '',
    path1: ad.path1 || '',
    path2: ad.path2 || '',
    displayPath: ad.displayPath || '',
    headlines: headlines,
    descriptions: descriptions,
    siteLinks: siteLinks
  };
}

export function normalizeMicrosoftAd(ad: Partial<GoogleAd>): GoogleAd {
  // Microsoft ads use the same structure as Google Ads
  return normalizeGoogleAd(ad);
}

export function normalizeMetaAd(ad: Partial<MetaAd>): MetaAd {
  return {
    id: ad.id || crypto.randomUUID(),
    headline: ad.headline || '',
    primaryText: ad.primaryText || '',
    description: ad.description || '',
    imagePrompt: ad.imagePrompt || '',
    imageUrl: ad.imageUrl || '',
    format: ad.format || 'feed',
    hashtags: ad.hashtags || []
  };
}
