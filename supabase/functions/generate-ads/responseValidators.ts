
import { WebsiteAnalysisResult } from "./types.ts";

// Language code simplification
export function getSimplifiedLanguageCode(languageCode: string): string {
  if (!languageCode) return 'pt';
  
  const code = languageCode.toLowerCase();
  if (code.startsWith('pt')) return 'pt';
  if (code.startsWith('en')) return 'en';
  if (code.startsWith('es')) return 'es';
  if (code.startsWith('fr')) return 'fr';
  if (code.startsWith('de')) return 'de';
  if (code.startsWith('it')) return 'it';
  
  return 'pt'; // Default to Portuguese if unknown
}

// Check if text contains English words
function containsEnglish(text: string): boolean {
  if (!text) return false;
  const englishWordPatterns = [
    /\bthe\b/i, /\band\b/i, /\bwith\b/i, /\bfor\b/i, /\byour\b/i, /\bservices?\b/i,
    /\bprofessional\b/i, /\bbusiness\b/i, /\blearn\b/i, /\bmore\b/i, /\bquality\b/i,
    /\btoday\b/i, /\bnow\b/i, /\bcontact\b/i, /\bus\b/i, /\bget\b/i, /\bdiscover\b/i
  ];
  
  return englishWordPatterns.some(pattern => pattern.test(text));
}

// Standardize punctuation
function fixPunctuation(text: string): string {
  if (!text) return "";
  let fixedText = text;
  
  // Fix multiple punctuation & whitespace
  fixedText = fixedText.replace(/,\./g, ',');
  fixedText = fixedText.replace(/\.{2,}/g, '.');
  fixedText = fixedText.replace(/\s+([,.!?;:])/g, '$1');
  fixedText = fixedText.replace(/([,.!?;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
  fixedText = fixedText.replace(/([,.!?;:])\1+/g, '$1');
  fixedText = fixedText.replace(/\s+/g, ' ').trim();
  
  // Ensure proper ending punctuation
  if (!/[.!?]$/.test(fixedText)) {
    fixedText = fixedText + '.';
  }
  
  return fixedText;
}

// Translate common English words to Portuguese
function translateEnglishToPt(text: string): string {
  if (!text) return "";
  
  const translations: Record<string, string> = {
    'Learn More': 'Saiba Mais',
    'Get Started': 'Comece Agora',
    'Discover': 'Descubra',
    'Contact Us': 'Entre em Contato',
    'with': 'com',
    'for': 'para',
    'your': 'seu',
    'our': 'nosso',
    'business': 'negócio',
    'and': 'e',
    'services': 'serviços',
    'solutions': 'soluções',
    'the': 'o',
    'Transform': 'Transforme',
    'quality': 'qualidade',
    'today': 'hoje',
    'get': 'obtenha',
    'contact': 'contato',
    'professional': 'profissional'
  };
  
  let fixedText = text;
  Object.entries(translations).forEach(([english, portuguese]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    fixedText = fixedText.replace(regex, portuguese);
  });
  
  return fixedText;
}

// Common sanitization for any ad text
function sanitizeText(text: string, attemptTranslation = true): string {
  if (!text) return "";
  let sanitized = text.trim();
  
  // Check if translation needed
  if (attemptTranslation && containsEnglish(sanitized)) {
    sanitized = translateEnglishToPt(sanitized);
  }
  
  return fixPunctuation(sanitized);
}

// Google Ads sanitizer
export function sanitizeGoogleAds(ads: any[], campaignData: WebsiteAnalysisResult): any[] {
  if (!Array.isArray(ads) || ads.length === 0) {
    return [];
  }
  
  return ads.map(ad => {
    // Extract fields using various possible naming patterns
    const headline1Raw = ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '';
    const headline2Raw = ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '';
    const headline3Raw = ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || '';
    const description1Raw = ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '';
    const description2Raw = ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || '';
    
    // Sanitize text
    const headline1 = sanitizeText(headline1Raw);
    const headline2 = sanitizeText(headline2Raw);
    const headline3 = sanitizeText(headline3Raw);
    const description1 = sanitizeText(description1Raw);
    const description2 = sanitizeText(description2Raw);
    
    // Ensure URL is Portuguese-friendly
    const rawUrl = ad.display_url || ad.displayPath || ad.displayUrl || 'exemplo.com.br';
    const displayPath = rawUrl.includes('.com') && !rawUrl.includes('.com.br') 
      ? rawUrl.replace('.com', '.com.br') 
      : rawUrl;
    
    return {
      headline1,
      headline2,
      headline3,
      description1,
      description2,
      displayPath,
      path1: ad.path1 || ad.path_1 || '',
      path2: ad.path2 || ad.path_2 || '',
      siteLinks: ad.siteLinks || ad.site_links || [],
    };
  });
}

// Microsoft Ads sanitizer
export function sanitizeMicrosoftAds(ads: any[], campaignData: WebsiteAnalysisResult): any[] {
  return sanitizeGoogleAds(ads, campaignData); // Identical format to Google Ads
}

// Meta Ads sanitizer
export function sanitizeMetaAds(ads: any[], campaignData: WebsiteAnalysisResult): any[] {
  if (!Array.isArray(ads) || ads.length === 0) {
    return [];
  }
  
  return ads.map(ad => {
    // Extract and sanitize fields
    const headlineRaw = ad.headline || ad.title || '';
    const primaryTextRaw = ad.primaryText || ad.text || ad.primary_text || '';
    const descriptionRaw = ad.description || ad.desc || '';
    const imagePromptRaw = ad.imagePrompt || ad.image_prompt || '';
    
    // Sanitize text
    const headline = sanitizeText(headlineRaw);
    const primaryText = sanitizeText(primaryTextRaw);
    const description = sanitizeText(descriptionRaw);
    
    // Ensure image prompt is appropriate
    let imagePrompt = imagePromptRaw;
    if (!imagePrompt) {
      imagePrompt = `Imagem profissional para anúncio de ${campaignData.companyName}, mostrando ${campaignData.product || 'o produto'} para ${campaignData.targetAudience || 'o público-alvo'}. Estilo profissional, sem texto.`;
    }
    
    // Add no-text instruction to image prompt if missing
    if (!imagePrompt.toLowerCase().includes('sem texto') && !imagePrompt.toLowerCase().includes('no text')) {
      imagePrompt += ' (SEM INCLUIR TEXTO OU PALAVRAS NA IMAGEM, APENAS ELEMENTOS VISUAIS)';
    }
    
    return {
      headline,
      primaryText,
      description: description || 'Saiba mais sobre nossos produtos e serviços.',
      imagePrompt,
      callToAction: ad.callToAction || ad.call_to_action || 'Saiba Mais',
      format: ad.format || 'feed',
      isComplete: true,
      imageUrl: ad.imageUrl || '',
    };
  });
}

// LinkedIn Ads sanitizer
export function sanitizeLinkedInAds(ads: any[], campaignData: WebsiteAnalysisResult): any[] {
  return sanitizeMetaAds(ads, campaignData); // Similar format to Meta Ads
}
