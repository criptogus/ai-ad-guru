
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

function ensureCompleteText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  // Adiciona ponto final se não terminar com pontuação
  const withPunctuation = /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + '.';
  // Corrige espaços após pontuação - garante espaço depois de pontos/vírgulas
  return withPunctuation.replace(/([.!?;:,])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
}

// Função melhorada para detectar texto em inglês
const hasEnglishText = (text: string) => {
  if (!text || typeof text !== 'string') return false;
  
  // Lista expandida de palavras comuns em inglês que não deveriam aparecer
  const englishWords = [
    'the', 'your', 'quality', 'service', 'with', 'and', 'for', 'our',
    'you', 'we', 'business', 'transform', 'get', 'now', 'more', 'learn',
    'discover', 'solutions', 'best', 'from', 'about', 'how', 'innovate',
    'transform', 'change', 'join', 'insights', 'professional'
  ];
  
  // Verifica a presença de termos em inglês - mais rigoroso
  const textLower = text.toLowerCase();
  let containsEnglish = false;
  
  // Verifica se o texto tem palavras em inglês específicas
  englishWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {
      console.warn(`⚠️ Palavra em inglês detectada: "${word}" no texto: "${truncate(textLower, 50)}"`);
      containsEnglish = true;
    }
  });
  
  // Verifica se NÃO contém caracteres acentuados (típicos do português)
  const containsPortugueseChars = /[áàâãéèêíìóòôõúùç]/i.test(textLower);
  
  // Se texto longo sem acentos e com palavras em inglês, provavelmente está em inglês
  if (textLower.length > 20 && !containsPortugueseChars && containsEnglish) {
    console.warn(`⚠️ Texto provavelmente em inglês: "${truncate(textLower, 50)}"`);
    return true;
  }
  
  return false;
};

// Utilitário para truncar strings no log.
const truncate = (str: string, max = 100) =>
  str && typeof str === 'string' ? (str.length > max ? str.substring(0, max) + "..." : str) : '[texto inválido]';

export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Gerando anúncios Meta para:', campaignData.companyName);
    console.log('Usando mind trigger:', mindTrigger || 'Nenhum');
    console.log('Idioma da campanha:', campaignData.language || 'português');

    // Forçando idioma português para garantir consistência
    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR', // Formato mais explícito para APIs
      languageName: 'português', // Nome explícito do idioma
      forcePortuguese: true // Força português explicitamente
    };

    console.log('Enviando requisição com idioma forçado:', updatedCampaignData.language);

    const { data, error } = await supabase.functions.invoke('generate-premium-ads', {
      body: {
        platform: 'meta',
        campaignData: {
          ...updatedCampaignData,
          mindTriggers: {
            meta: mindTrigger
          },
          language: 'pt_BR', // Reforçando no nível mais externo
          languagePreference: 'Português do Brasil', // Texto explícito
          forcePortuguese: true, // Flag adicional
        }
      },
    });

    if (error) {
      console.error('Erro ao gerar anúncios Meta:', error);
      toast.error('Falha ao gerar anúncios Meta', {
        description: error.message || 'Erro desconhecido'
      });
      return null;
    }

    if (!data?.success) {
      console.error('Falha na geração de anúncios Meta:', data?.error || 'Erro desconhecido');
      toast.error('Falha na geração de anúncios Meta', {
        description: data?.error || 'Não foi possível gerar o conteúdo dos anúncios'
      });
      return null;
    }

    if (!Array.isArray(data.data)) {
      console.error('Resposta inválida da IA:', data.data);
      toast.error('Erro de formato', {
        description: 'A resposta da IA não estava no formato esperado.'
      });
      return null;
    }

    // Validação aprimorada para garantir completude do anúncio
    if (!data.data.every((ad: any) => ad.headline && (ad.primaryText || ad.text) && ad.imagePrompt)) {
      console.warn("Alguns anúncios gerados estão incompletos:", data.data);
      toast.warning("Atenção: Alguns anúncios podem estar incompletos", {
        description: "Revise os campos dos anúncios antes de publicar."
      });
    }

    const metaAds = data.data.map((ad: any) => {
      // Verifica se o texto está em inglês e tenta corrigi-lo
      const originalText = ad.primaryText || ad.text || '';
      let primaryText = ensureCompleteText(originalText);
      let headline = ensureCompleteText(ad.headline || '');
      
      // Verificações de idioma mais rigorosas
      if (hasEnglishText(headline) || hasEnglishText(primaryText)) {
        console.warn('⚠️ Texto em inglês detectado no anúncio. Tentando aplicar correções.');
        
        // Logging detalhado
        console.warn({
          headline_original: headline,
          primaryText_original: truncate(primaryText, 100),
          containsEnglish: true
        });
        
        // Tenta traduzir manualmente termos comuns (abordagem de emergência)
        headline = headline
          .replace(/transform/gi, 'transforme')
          .replace(/discover/gi, 'descubra')
          .replace(/service/gi, 'serviço')
          .replace(/quality/gi, 'qualidade')
          .replace(/professional/gi, 'profissional')
          .replace(/business/gi, 'negócio')
          .replace(/learn/gi, 'aprenda')
          .replace(/join/gi, 'participe')
          .replace(/insights/gi, 'insights');
          
        primaryText = primaryText
          .replace(/transform/gi, 'transforme')
          .replace(/discover/gi, 'descubra')
          .replace(/service/gi, 'serviço')
          .replace(/quality/gi, 'qualidade')
          .replace(/professional/gi, 'profissional')
          .replace(/business/gi, 'negócio')
          .replace(/learn/gi, 'aprenda')
          .replace(/join/gi, 'participe')
          .replace(/insights/gi, 'insights');
        
        // Aviso para o usuário
        toast.warning('Conteúdo em inglês detectado', {
          description: 'Alguns textos dos anúncios podem não estar em português.'
        });
      }

      // Melhora o prompt de imagem para evitar texto na imagem
      let imagePrompt = ad.imagePrompt ?? ad.image_prompt ?? '[FALHA AO GERAR PROMPT DE IMAGEM]';
      if (!imagePrompt.toLowerCase().includes('sem texto') && 
          !imagePrompt.toLowerCase().includes('no text')) {
        imagePrompt += ' (sem incluir nenhum texto ou palavras na imagem, apenas elementos visuais)';
      }

      return {
        headline: headline,
        primaryText: primaryText,
        description: ensureCompleteText(ad.description || ''),
        imagePrompt: imagePrompt,
        callToAction: ad.callToAction ?? 'Saiba Mais',
        format: ad.format ?? 'feed',
        isComplete: true,
        imageUrl: ad.imageUrl || '', // Adiciona suporte para URL da imagem
      };
    });

    console.log('Anúncios Meta gerados com sucesso:', metaAds.length);
    console.log('Exemplo de anúncio gerado:', JSON.stringify(metaAds[0], null, 2));
    
    return metaAds;
  } catch (error) {
    console.error('Erro em generateMetaAds:', error);
    toast.error('Erro ao gerar anúncios Meta', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
