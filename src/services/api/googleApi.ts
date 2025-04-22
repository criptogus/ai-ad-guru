
import { supabase } from '@/integrations/supabase/client';
import { GoogleAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

/**
 * Generates Google ad suggestions based on website analysis results
 * 
 * @param campaignData The website analysis result data
 * @param mindTrigger Optional mind trigger to enhance ad creation
 * @returns An array of GoogleAd objects or null if generation fails
 */
export const generateGoogleAds = async (
  campaignData: WebsiteAnalysisResult, 
  mindTrigger?: string
): Promise<GoogleAd[] | null> => {
  try {
    console.log('Gerando anúncios Google para:', campaignData.companyName);
    console.log('Usando mind trigger:', mindTrigger || 'Nenhum');
    
    // Garantindo que temos os dados necessários
    if (!campaignData || !campaignData.companyName) {
      console.error('Dados necessários para geração de anúncios ausentes');
      toast.error('Dados incompletos', {
        description: 'Informações da empresa são necessárias para gerar anúncios.'
      });
      return null;
    }
    
    // Forçar a linguagem para português de forma mais explícita
    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR', // Formato padrão de código de idioma
      languageName: 'português', // Nome explícito do idioma
      forcePortuguese: true, // Flag adicional
      languagePreference: 'Português do Brasil', // Texto explícito
    };
    
    console.log('Enviando requisição com configuração de idioma:', {
      language: updatedCampaignData.language,
      languageName: updatedCampaignData.languageName
    });
    
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'google',
        campaignData: updatedCampaignData,
        mindTrigger,
        temperature: 0.2, // Temperatura mais baixa para consistência
        systemInstructions: "Sua resposta DEVE ser em português do Brasil. Não use inglês em nenhuma parte do texto."
      },
    });

    if (error) {
      console.error('Erro ao gerar anúncios Google:', error);
      toast.error('Falha na geração', {
        description: error.message || 'Não foi possível conectar ao serviço de geração'
      });
      return null;
    }

    if (!data || !data.success) {
      console.error('Falha na geração de anúncios Google:', data?.error || 'Erro desconhecido');
      toast.error('Falha na geração', {
        description: data?.error || 'O serviço não conseguiu gerar os anúncios'
      });
      return null;
    }

    // Validar e corrigir a resposta
    let adsToProcess = [];
    
    // Processar a resposta dependendo do formato
    if (data.data) {
      if (typeof data.data === 'string') {
        try {
          adsToProcess = JSON.parse(data.data);
          console.log('Resposta em string convertida para objeto:', adsToProcess.length, 'anúncios');
        } catch (parseError) {
          console.error('Falha ao analisar resposta como JSON:', parseError);
          toast.error('Erro de formato', {
            description: 'A resposta não estava no formato esperado'
          });
          return null;
        }
      } else if (Array.isArray(data.data)) {
        adsToProcess = data.data;
        console.log('Resposta recebida como array:', adsToProcess.length, 'anúncios');
      } else {
        console.error('Formato de resposta inválido:', typeof data.data);
        toast.error('Erro de formato', {
          description: 'A resposta não estava no formato esperado'
        });
        return null;
      }
    } else {
      console.error('Nenhum dado retornado na resposta');
      toast.error('Resposta vazia', {
        description: 'O serviço não retornou dados'
      });
      return null;
    }
    
    // Função melhorada para detectar e corrigir texto em inglês
    const detectAndFixEnglish = (text: string): string => {
      if (!text) return "";
      
      // Mapeamento de termos comuns em inglês para português
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
      
      // Substituir termos em inglês por suas versões em português
      let fixedText = text;
      Object.entries(translations).forEach(([english, portuguese]) => {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        fixedText = fixedText.replace(regex, portuguese);
      });
      
      return fixedText;
    };
    
    // Validar e normalizar os anúncios
    const validatedAds = adsToProcess.map((ad: any) => {
      const headline1 = fixTextSpacing(detectAndFixEnglish(ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || ''));
      const headline2 = fixTextSpacing(detectAndFixEnglish(ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || ''));
      const headline3 = fixTextSpacing(detectAndFixEnglish(ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || ''));
      const description1 = fixTextSpacing(detectAndFixEnglish(ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || ''));
      const description2 = fixTextSpacing(detectAndFixEnglish(ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || ''));
      
      // Log detalhado para debug
      console.log('Anúncio normalizado:', { 
        original: {
          headline1: ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '',
          description1: ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || ''
        },
        normalizado: {
          headline1, 
          description1
        }
      });
      
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
    
    console.log('Anúncios Google processados:', validatedAds.length);
    if (validatedAds.length > 0) {
      console.log('Exemplo do primeiro anúncio:', JSON.stringify(validatedAds[0], null, 2));
    }
    
    return validatedAds as GoogleAd[];
  } catch (error) {
    console.error('Erro em generateGoogleAds:', error);
    toast.error('Erro inesperado', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro ao gerar os anúncios'
    });
    return null;
  }
};

// Função auxiliar para corrigir espaços após pontuação
function fixTextSpacing(text: string): string {
  if (!text) return "";
  
  // Adiciona espaço após pontuação se não existir
  let fixedText = text.replace(/([.!?;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
  
  // Se o texto não terminar com pontuação, adiciona ponto final
  if (!/[.!?;:]$/.test(fixedText)) {
    fixedText = fixedText + '.';
  }
  
  return fixedText;
}
