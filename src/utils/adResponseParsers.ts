
/**
 * Utility functions to parse structured ad text responses from OpenAI
 * into platform-specific ad formats
 */

import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

/**
 * Extracts a specific section from the OpenAI response
 */
function extractSection(adText: string, sectionTitle: string): string {
  return adText.split(`## ${sectionTitle}`)[1]?.split('##')[0] || '';
}

/**
 * Parses Google Ads text into structured format
 */
export function parseGoogleAds(adText: string): GoogleAd[] {
  const section = extractSection(adText, 'Google Ads');
  if (!section) return [];
  
  const regex = /Ad \d+:\s*- H1:\s*(.*?)\s*- H2:\s*(.*?)\s*- Desc 1:\s*(.*?)\s*- Desc 2:\s*(.*?)(?=Ad \d+:|$)/gs;
  const ads: GoogleAd[] = [];
  
  let match;
  while ((match = regex.exec(section)) !== null) {
    ads.push({
      headline1: match[1]?.trim() || '',
      headline2: match[2]?.trim() || '',
      headline3: 'Learn More', // Default
      description1: match[3]?.trim() || '',
      description2: match[4]?.trim() || '',
      path1: 'services',
      path2: 'info',
      siteLinks: []
    });
  }
  
  return ads;
}

/**
 * Parses Instagram/Meta Ads text into structured format
 */
export function parseMetaAds(adText: string): MetaAd[] {
  const section = extractSection(adText, 'Instagram Ads');
  if (!section) return [];
  
  const regex = /Ad \d+:\s*Text:\s*([\s\S]*?)(?=Ad \d+:|$)/g;
  const ads: MetaAd[] = [];
  
  let match;
  while ((match = regex.exec(section)) !== null) {
    const text = match[1]?.trim() || '';
    ads.push({
      headline: text.split('\n')[0] || 'Discover More',
      primaryText: text,
      description: '',
      imagePrompt: `Professional ad image showcasing ${text.substring(0, 100)}...`
    });
  }
  
  return ads;
}

/**
 * Parses LinkedIn Ads text into structured format
 */
export function parseLinkedInAds(adText: string): MetaAd[] {
  const section = extractSection(adText, 'LinkedIn Ads');
  if (!section) return [];
  
  const regex = /Ad \d+:\s*Text:\s*([\s\S]*?)(?=Ad \d+:|$)/g;
  const ads: MetaAd[] = [];
  
  let match;
  while ((match = regex.exec(section)) !== null) {
    const text = match[1]?.trim() || '';
    ads.push({
      headline: text.split('\n')[0] || 'Learn More',
      primaryText: text,
      description: '',
      imagePrompt: `Professional LinkedIn image related to: ${text.substring(0, 100)}...`
    });
  }
  
  return ads;
}

/**
 * Parses Microsoft/Bing Ads text into structured format
 */
export function parseMicrosoftAds(adText: string): GoogleAd[] {
  const section = extractSection(adText, 'Bing Ads');
  if (!section) return [];
  
  const regex = /Ad \d+:\s*- H1:\s*(.*?)\s*- H2:\s*(.*?)\s*- Desc 1:\s*(.*?)\s*- Desc 2:\s*(.*?)(?=Ad \d+:|$)/gs;
  const ads: GoogleAd[] = [];
  
  let match;
  while ((match = regex.exec(section)) !== null) {
    ads.push({
      headline1: match[1]?.trim() || '',
      headline2: match[2]?.trim() || '',
      headline3: 'Learn More', // Default
      description1: match[3]?.trim() || '',
      description2: match[4]?.trim() || '',
      path1: 'services',
      path2: 'info',
      siteLinks: []
    });
  }
  
  return ads;
}

