
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

export const normalizeGoogleAd = (ad: any): GoogleAd => ({
  headline1: ad.headline_1 || ad.headline1 || '',
  headline2: ad.headline_2 || ad.headline2 || '',
  headline3: ad.headline_3 || ad.headline3 || '',
  description1: ad.description_1 || ad.description1 || '',
  description2: ad.description_2 || ad.description2 || '',
  displayPath: ad.display_url || ad.displayPath || 'example.com',
  path1: ad.path1 || '',
  path2: ad.path2 || '',
  siteLinks: ad.siteLinks || [],
});

export const normalizeMetaAd = (ad: any): MetaAd => ({
  headline: ad.headline || '',
  primaryText: ensureCompleteText(ad.primaryText || ad.text || ''),
  description: ensureCompleteText(ad.description || ''),
  imagePrompt: ad.imagePrompt ?? ad.image_prompt ?? '',
  callToAction: ad.callToAction ?? 'Saiba Mais',
  format: ad.format ?? 'feed',
  isComplete: true,
});

function ensureCompleteText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  return /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + '.';
}
