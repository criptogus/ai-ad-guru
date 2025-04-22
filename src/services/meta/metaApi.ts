
import { supabase } from '@/integrations/supabase/client';
import { MetaAd } from '@/hooks/adGeneration';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { toast } from 'sonner';

// Função para completar o texto e garantir pontuação final
function ensureCompleteText(text: string): string {
  if (!text) return '';
  const trimmed = text.trim();
  // Adiciona ponto final se não terminar com pontuação
  const withPunctuation = /[.!?;:]$/.test(trimmed) ? trimmed : trimmed + '.';
  // Corrige espaços após pontuação - garante espaço depois de pontos/vírgulas
  return withPunctuation.replace(/([.!?;:,])([A-Za-zÀ-ÖØ-öø-ÿ])/g, '$1 $2');
}

// Função detalhada para detectar texto em inglês
const hasEnglishText = (text: string) => {
  if (!text || typeof text !== 'string') return false;
  
  // Lista completa de palavras comuns em inglês que não deveriam aparecer
  const englishWords = [
    'the', 'your', 'quality', 'service', 'with', 'and', 'for', 'our',
    'you', 'we', 'business', 'transform', 'get', 'now', 'more', 'learn',
    'discover', 'solutions', 'best', 'from', 'about', 'how', 'innovate',
    'transform', 'change', 'join', 'insights', 'professional', 'services'
  ];
  
  // Verifica a presença de termos em inglês - mais rigoroso
  const textLower = text.toLowerCase();
  let englishWordFound = null;
  
  // Verifica se o texto tem palavras em inglês específicas
  for (const word of englishWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {
      console.warn(`⚠️ Palavra em inglês detectada: "${word}" no texto: "${truncate(textLower, 50)}"`);
      englishWordFound = word;
      break;
    }
  }
  
  // Verifica se NÃO contém caracteres acentuados típicos do português
  const containsPortugueseChars = /[áàâãéèêíìóòôõúùç]/i.test(textLower);
  
  // Se texto longo sem acentos e com palavras em inglês, provavelmente está em inglês
  if ((textLower.length > 20 && !containsPortugueseChars && englishWordFound) || 
      (englishWordFound && ['service', 'professional', 'business', 'transform'].includes(englishWordFound))) {
    console.warn(`❌ Texto em inglês confirmado: "${truncate(textLower, 50)}"`);
    return true;
  }
  
  return false;
};

// Utilitário para truncar strings no log.
const truncate = (str: string, max = 100) =>
  str && typeof str === 'string' ? (str.length > max ? str.substring(0, max) + "..." : str) : '[texto inválido]';

// Função para verificar se o texto está completo e tem sentido
function isIncompleteText(text: string): boolean {
  if (!text || typeof text !== 'string') return true;
  const trimmed = text.trim();
  
  // Verifica se o texto tem menos de 5 palavras
  if (trimmed.split(/\s+/).length < 5) return true;
  
  // Verifica se o texto parece truncado (termina sem pontuação e a última palavra tem mais de 3 letras)
  const lastWordMatch = trimmed.match(/(\S+)$/);
  if (lastWordMatch && 
      !trimmed.match(/[.!?;:]$/) && 
      lastWordMatch[1].length > 3 &&
      !trimmed.includes('...')) {
    return true;
  }
  
  // Verifica palavras truncadas (palavras com mais de 3 caracteres e menos de 5)
  const words = trimmed.split(/\s+/);
  for (const word of words) {
    if (word.length > 3 && word.length < 5 && !word.match(/[.!?;:,]$/)) {
      // Verifica se parece uma palavra completa em português
      if (!['para', 'como', 'mais', 'novo', 'hoje', 'aqui', 'cada', 'muito', 'anos', 'pela', 'pelo'].includes(word.toLowerCase())) {
        return true;
      }
    }
  }
  
  return false;
}

// Função principal para gerar anúncios Meta
export const generateMetaAds = async (
  campaignData: WebsiteAnalysisResult,
  mindTrigger?: string
): Promise<MetaAd[] | null> => {
  try {
    console.log('Gerando anúncios Meta para:', campaignData.companyName);
    console.log('Usando mind trigger:', mindTrigger || 'Nenhum');
    
    // Dados adicionais para dar contexto mais específico
    let productContext = '';
    if (campaignData.industry) {
      productContext = `Atua no setor de ${campaignData.industry}. `;
    }
    if (campaignData.product) {
      productContext += `Oferece ${campaignData.product}. `;
    }
    
    if (campaignData.targetAudience) {
      productContext += `Público-alvo: ${campaignData.targetAudience}. `;
    }

    // Forçando idioma português de modo explícito
    const updatedCampaignData = {
      ...campaignData,
      language: 'pt_BR',
      languageName: 'português brasileiro',
      forcePortuguese: true,
      productContext
    };

    console.log('Enviando requisição com contexto ampliado e idioma forçado:', updatedCampaignData.language);

    const { data, error } = await supabase.functions.invoke('generate-premium-ads', {
      body: {
        platform: 'meta',
        campaignData: {
          ...updatedCampaignData,
          mindTriggers: {
            meta: mindTrigger
          },
          language: 'pt_BR',
          languagePreference: 'Português do Brasil',
          forcePortuguese: true,
          instructions: "GERE APENAS EM PORTUGUÊS DO BRASIL. NADA EM INGLÊS."
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

    // Validação aprimorada para garantir completude e qualidade do anúncio
    const validatedAds = data.data.filter((ad: any) => {
      // Verifica se tem todos os campos necessários
      const hasRequiredFields = ad.headline && (ad.primaryText || ad.text) && ad.imagePrompt;
      
      if (!hasRequiredFields) {
        console.warn("❌ Anúncio rejeitado por campos incompletos:", ad);
        return false;
      }
      
      // Verifica se o texto está em português
      const primaryText = ad.primaryText || ad.text || '';
      const headline = ad.headline || '';
      
      if (hasEnglishText(headline) || hasEnglishText(primaryText)) {
        console.warn("❌ Anúncio rejeitado por texto em inglês:", ad);
        return false;
      }
      
      // Verifica se o texto está truncado ou incompleto
      if (isIncompleteText(primaryText) || isIncompleteText(headline)) {
        console.warn("❌ Anúncio rejeitado por texto incompleto:", ad);
        return false;
      }
      
      return true;
    });
    
    if (validatedAds.length === 0) {
      console.error("❌ Todos os anúncios foram rejeitados pelos critérios de qualidade");
      toast.error("Falha na geração dos anúncios", {
        description: "Os anúncios gerados não atenderam aos critérios mínimos de qualidade"
      });
      return null;
    }

    const metaAds = validatedAds.map((ad: any) => {
      // Aplicar correções finais de formatação
      let primaryText = ensureCompleteText(ad.primaryText || ad.text || '');
      let headline = ensureCompleteText(ad.headline || '');
      
      // Evitar hashtags genéricas
      if (primaryText.includes('#profissional') || primaryText.includes('#serviço')) {
        primaryText = primaryText
          .replace(/#profissional/g, '')
          .replace(/#serviço/g, '')
          .replace(/#service/g, '')
          .replace(/  +/g, ' ');
      }

      // Garantir que o prompt da imagem evita texto
      let imagePrompt = ad.imagePrompt ?? ad.image_prompt ?? '[FALHA AO GERAR PROMPT DE IMAGEM]';
      
      // Sempre adicionar instrução SANS TEXT ao prompt
      if (!imagePrompt.toLowerCase().includes('sem texto') && 
          !imagePrompt.toLowerCase().includes('no text')) {
        imagePrompt += ' (SEM INCLUIR NENHUM TEXTO OU PALAVRAS NA IMAGEM, APENAS ELEMENTOS VISUAIS)';
      }
      
      // Adicionar contexto brasileiro ao prompt de imagem
      if (!imagePrompt.toLowerCase().includes('brasil') && 
          !imagePrompt.toLowerCase().includes('público brasileiro')) {
        imagePrompt += ' Aparecem pessoas brasileiras no contexto brasileiro.';
      }

      return {
        headline: headline,
        primaryText: primaryText,
        description: ensureCompleteText(ad.description || ad.callToAction || 'Saiba Mais'),
        imagePrompt: imagePrompt,
        callToAction: ad.callToAction ?? 'Saiba Mais',
        format: ad.format ?? 'feed',
        isComplete: true,
        imageUrl: ad.imageUrl || ''
      };
    });

    console.log('Anúncios Meta gerados e validados com sucesso:', metaAds.length);
    console.log('Exemplo de anúncio validado:', JSON.stringify(metaAds[0], null, 2));
    
    // Criar placeholder para imagens (para não depender da geração posterior)
    const metaAdsWithPlaceholders = metaAds.map((ad, index) => {
      if (!ad.imageUrl) {
        // Create a safe placeholder URL based on company name
        const safeCompanyName = encodeURIComponent(campaignData.companyName || 'Ad');
        ad.imageUrl = `https://placehold.co/600x600?text=${safeCompanyName}+${index+1}`;
      }
      return ad;
    });
    
    return metaAdsWithPlaceholders;
  } catch (error) {
    console.error('Erro em generateMetaAds:', error);
    toast.error('Erro ao gerar anúncios Meta', {
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido'
    });
    return null;
  }
};
