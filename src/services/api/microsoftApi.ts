import { supabase } from '@/integrations/supabase/client';
import { GoogleAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

function detectAndFixEnglish(text: string): string {
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
    'Transform': 'Transforme'
  };
  let fixedText = text;
  Object.entries(translations).forEach(([english, portuguese]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    fixedText = fixedText.replace(regex, portuguese);
  });
  return fixedText;
}

function fixPunctuation(text: string): string {
  if (!text) return "";
  let fixedText = text.replace(/,\./g, ',');
  fixedText = fixedText.replace(/\.{2,}/g, '.');
  fixedText = fixedText.replace(/\s+([,.!?;:])/g, '$1');
  fixedText = fixedText.replace(/([,.!?;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
  fixedText = fixedText.replace(/([,.!?;:])\1+/g, '$1');
  fixedText = fixedText.replace(/\s+/g, ' ').trim();
  if (!/[.!?]$/.test(fixedText)) {
    fixedText = fixedText + '.';
  }
  return fixedText;
}

export const generateMicrosoftAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<GoogleAd[] | null> => {
  try {
    console.log('Generating Microsoft ads for:', campaignData.companyName);
    console.log('Using mind trigger:', mindTrigger || 'None');
    
    // Force Portuguese
    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR',
      languageName: 'português',
      forcePortuguese: true,
      languagePreference: 'Português do Brasil'
    };

    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'microsoft',
        campaignData: updatedCampaignData,
        mindTrigger,
        temperature: 0.2,
        systemInstructions: "Sua resposta DEVE ser em português do Brasil. Não use inglês em nenhuma parte do texto."
      },
    });

    if (error) {
      console.error('Error generating Microsoft ads:', error);
      return null;
    }

    if (!data || !data.success) {
      console.error('Microsoft ads generation failed:', data?.error || 'Unknown error');
      return null;
    }

    // Normalize every ad like google
    let adsToProcess = [];
    if (data.data) {
      if (typeof data.data === 'string') {
        try {
          adsToProcess = JSON.parse(data.data);
        } catch {
          return null;
        }
      } else if (Array.isArray(data.data)) {
        adsToProcess = data.data;
      } else {
        return null;
      }
    } else {
      return null;
    }

    const validatedAds = adsToProcess.map((ad: any) => {
      const headline1Raw = ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '';
      const headline2Raw = ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '';
      const headline3Raw = ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || '';
      const description1Raw = ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '';
      const description2Raw = ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || '';
      const headline1 = fixPunctuation(detectAndFixEnglish(headline1Raw));
      const headline2 = fixPunctuation(detectAndFixEnglish(headline2Raw));
      const headline3 = fixPunctuation(detectAndFixEnglish(headline3Raw));
      const description1 = fixPunctuation(detectAndFixEnglish(description1Raw));
      const description2 = fixPunctuation(detectAndFixEnglish(description2Raw));
      return {
        headline1,
        headline2,
        headline3,
        description1,
        description2,
        displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'exemplo.com',
        path1: ad.path1 || ad.path_1 || '',
        path2: ad.path2 || ad.path_2 || '',
        siteLinks: ad.siteLinks || ad.site_links || [],
      };
    });

    return validatedAds as GoogleAd[];
  } catch (error) {
    console.error('Error in generateMicrosoftAds:', error);
    return null;
  }
};
