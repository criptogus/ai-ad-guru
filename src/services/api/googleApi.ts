
import { supabase } from '@/integrations/supabase/client';
import { GoogleAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

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
      return null;
    }
    
    // Forçar a linguagem para português
    const updatedCampaignData = {
      ...campaignData,
      language: 'português', // Forçando português explicitamente
    };
    
    const { data, error } = await supabase.functions.invoke('generate-ads', {
      body: { 
        platform: 'google',
        campaignData: updatedCampaignData,
        mindTrigger,
        temperature: 0.3 // Temperatura mais baixa para resultados mais consistentes
      },
    });

    if (error) {
      console.error('Erro ao gerar anúncios Google:', error);
      return null;
    }

    if (!data || !data.success) {
      console.error('Falha na geração de anúncios Google:', data?.error || 'Erro desconhecido');
      return null;
    }

    // Validar estrutura de dados da resposta
    if (!data.data || !Array.isArray(data.data)) {
      console.error('Formato de resposta inválido de generate-ads:', data);
      
      // Tentar analisar se uma string foi retornada
      if (typeof data.data === 'string') {
        try {
          const parsedData = JSON.parse(data.data);
          console.log('Resposta em string analisada com sucesso:', parsedData);
          
          if (Array.isArray(parsedData)) {
            // Garantir que todos os campos necessários estejam presentes
            const validatedAds = parsedData.map((ad: any) => ({
              headline1: fixTextSpacing(ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || ''),
              headline2: fixTextSpacing(ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || ''),
              headline3: fixTextSpacing(ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || ''),
              description1: fixTextSpacing(ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || ''),
              description2: fixTextSpacing(ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || ''),
              displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'exemplo.com',
              path1: ad.path1 || ad.path_1 || '',
              path2: ad.path2 || ad.path_2 || '',
              siteLinks: ad.siteLinks || ad.site_links || [],
            }));
            
            console.log('🧪 Anúncios Google validados:', validatedAds);
            return validatedAds as GoogleAd[];
          }
        } catch (parseError) {
          console.error('Falha ao analisar resposta como JSON:', parseError);
          return null;
        }
      }
      
      return null;
    }

    console.log('Anúncios Google gerados com sucesso:', data.data);
    console.log('🧪 Exemplo do primeiro anúncio:', data.data[0]);
    
    // Garantir que todos os campos necessários estejam presentes e com espaçamento correto
    const validatedAds = data.data.map((ad: any) => ({
      headline1: fixTextSpacing(ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || ''),
      headline2: fixTextSpacing(ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || ''),
      headline3: fixTextSpacing(ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || ''),
      description1: fixTextSpacing(ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || ''),
      description2: fixTextSpacing(ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || ''),
      displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'exemplo.com',
      path1: ad.path1 || ad.path_1 || '',
      path2: ad.path2 || ad.path_2 || '',
      siteLinks: ad.siteLinks || ad.site_links || [],
    }));
    
    console.log('🧪 Anúncios Google validados:', validatedAds);
    return validatedAds as GoogleAd[];
  } catch (error) {
    console.error('Erro em generateGoogleAds:', error);
    return null;
  }
};

// Função auxiliar para corrigir espaços após pontuação
function fixTextSpacing(text: string): string {
  if (!text) return "";
  
  // Adiciona espaço após pontuação se não existir
  return text.replace(/([.!?;:])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
}
