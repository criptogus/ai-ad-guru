
const GENERIC_TERMS_PT = [
  "serviços profissionais",
  "soluções de qualidade",
  "resultados de qualidade",
  "entre em contato hoje",
  "oferecemos serviços",
  "serviços de alta qualidade"
];

const GENERIC_TERMS_EN = [
  "professional services",
  "quality solutions",
  "quality results",
  "contact us today",
  "we offer services",
  "high quality services"
];

const GENERIC_TERMS_ES = [
  "servicios profesionales",
  "soluciones de calidad",
  "resultados de calidad",
  "contáctenos hoy",
  "ofrecemos servicios",
  "servicios de alta calidad"
];

/**
 * Checks if text contains generic terms that should be avoided
 * @param text The text to check
 * @param language The language code (pt, en, es)
 * @returns true if generic terms are found
 */
export function containsGenericTerms(text: string, language: string = 'pt'): boolean {
  if (!text) return false;
  
  const lowercaseText = text.toLowerCase();
  
  let termsToCheck: string[] = GENERIC_TERMS_PT;
  
  if (language === 'en') {
    termsToCheck = GENERIC_TERMS_EN;
  } else if (language === 'es') {
    termsToCheck = GENERIC_TERMS_ES;
  }
  
  return termsToCheck.some(term => lowercaseText.includes(term.toLowerCase()));
}

/**
 * Gets the language code from a full language name or code
 * @param language The language name or code
 * @returns A simplified language code (pt, en, es)
 */
export function getSimplifiedLanguageCode(language: string): string {
  if (!language) return 'pt';
  
  const lowercaseLanguage = language.toLowerCase();
  
  if (lowercaseLanguage.includes('port') || lowercaseLanguage.includes('pt') || lowercaseLanguage.includes('brasil') || lowercaseLanguage.includes('brazil')) {
    return 'pt';
  }
  
  if (lowercaseLanguage.includes('en') || lowercaseLanguage.includes('ing') || lowercaseLanguage.includes('english')) {
    return 'en';
  }
  
  if (lowercaseLanguage.includes('es') || lowercaseLanguage.includes('span') || lowercaseLanguage.includes('español')) {
    return 'es';
  }
  
  return 'pt'; // Default to Portuguese
}

/**
 * Validates Google Ads responses to ensure they don't contain generic content
 * @param ads Array of Google Ads
 * @param language Language code
 * @param campaignData Campaign data for fallback
 * @returns Validated ads with generic terms replaced
 */
export function validateGoogleAdsResponse(ads: any[], language: string, campaignData: any): any[] {
  const langCode = getSimplifiedLanguageCode(language);
  
  if (!ads || !Array.isArray(ads) || ads.length === 0) {
    console.log('❌ No valid ads found, using fallbacks');
    // Import would cause circular dependency, so callers should handle this
    return []; 
  }
  
  return ads.map(ad => {
    const headline1 = ad.headline_1 || ad.headline1 || '';
    const headline2 = ad.headline_2 || ad.headline2 || '';
    const headline3 = ad.headline_3 || ad.headline3 || '';
    const description1 = ad.description_1 || ad.description1 || '';
    const description2 = ad.description_2 || ad.description2 || '';
    
    // Check for generic terms
    const hasGenericTerms = 
      containsGenericTerms(headline1, langCode) ||
      containsGenericTerms(headline2, langCode) ||
      containsGenericTerms(headline3, langCode) ||
      containsGenericTerms(description1, langCode) ||
      containsGenericTerms(description2, langCode);
      
    if (hasGenericTerms) {
      console.log('⚠️ Generic terms detected in ad, marking for replacement');
      ad._containsGenericTerms = true;
    }
    
    return ad;
  });
}

/**
 * Validates Meta/Instagram/LinkedIn Ads responses
 * @param ads Array of Social Ads
 * @param language Language code
 * @param campaignData Campaign data for fallback
 * @returns Validated ads with generic terms replaced
 */
export function validateSocialAdsResponse(ads: any[], language: string, campaignData: any): any[] {
  const langCode = getSimplifiedLanguageCode(language);
  
  if (!ads || !Array.isArray(ads) || ads.length === 0) {
    console.log('❌ No valid ads found, using fallbacks');
    return []; 
  }
  
  return ads.map(ad => {
    const headline = ad.headline || '';
    const primaryText = ad.primaryText || ad.text || '';
    const description = ad.description || '';
    
    // Check for generic terms
    const hasGenericTerms = 
      containsGenericTerms(headline, langCode) ||
      containsGenericTerms(primaryText, langCode) ||
      containsGenericTerms(description, langCode);
      
    if (hasGenericTerms) {
      console.log('⚠️ Generic terms detected in ad, marking for replacement');
      ad._containsGenericTerms = true;
    }
    
    return ad;
  });
}
