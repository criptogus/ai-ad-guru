
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '../useWebsiteAnalysis';
import { GoogleAd } from './types';
import { toast } from 'sonner';

// Função para verificar se o texto parece estar truncado ou incompleto
function isTextIncomplete(text: string): boolean {
  if (!text) return true;
  
  // Verifica se termina com pontuação
  if (!/[.!?;:]$/.test(text)) {
    // Dá mais chances a textos curtos que podem ser comandos como "Saiba mais"
    if (text.length > 15) return true;
  }
  
  // Verifica se todas as palavras parecem completas (não truncadas)
  const words = text.split(/\s+/);
  const lastWord = words[words.length - 1];
  
  // Se a última palavra tem mais de 4 letras e não termina com pontuação,
  // pode estar truncada
  if (lastWord && lastWord.length > 4 && !/[.!?;:,]$/.test(lastWord)) {
    // Verifica se a palavra existe em uma lista de palavras comuns em português
    const commonWords = ['sobre', 'agora', 'nosso', 'nossa', 'entre', 'ainda', 'temos', 'todos', 'todas'];
    if (!commonWords.includes(lastWord.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

// Função para detectar facilmente texto em inglês
function isEnglishText(text: string): boolean {
  if (!text) return false;
  
  // Lista de palavras comuns em inglês
  const englishWords = ['the', 'and', 'with', 'your', 'our', 'we', 'for', 'in', 'on', 'by', 'of', 'to'];
  const textLower = text.toLowerCase();
  
  // Verifica se tem palavras em inglês e não tem caracteres acentuados em português
  let hasEnglishWord = false;
  for (const word of englishWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {
      hasEnglishWord = true;
      break;
    }
  }
  
  const hasPortugueseChars = /[áàâãéèêíìóòôõúùç]/i.test(textLower);
  
  // Textos longos sem acentos portugueses e com palavras inglesas são suspeitos
  if (hasEnglishWord && text.length > 15 && !hasPortugueseChars) {
    return true;
  }
  
  return false;
}

// Função para garantir que o texto está completo
function completeText(text: string, maxLength: number): string {
  if (!text) return '';
  
  if (isTextIncomplete(text) && text.length < maxLength) {
    // Adicionar ponto final se o texto parece incompleto mas está abaixo do limite
    return text.endsWith('.') ? text : text + '.';
  }
  
  // Se o texto é muito longo, cortar até o último ponto final seguro
  if (text.length > maxLength) {
    const lastSafePeriod = text.substring(0, maxLength).lastIndexOf('.');
    if (lastSafePeriod > maxLength * 0.7) { // Se achou um ponto após 70% do comprimento máximo
      return text.substring(0, lastSafePeriod + 1);
    } else {
      // Cortar na última palavra completa e adicionar ponto
      const truncated = text.substring(0, maxLength).replace(/\s\S+$/, '');
      return truncated.endsWith('.') ? truncated : truncated + '.';
    }
  }
  
  return text;
}

export const useGoogleAds = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateGoogleAds = async (campaignData: WebsiteAnalysisResult) => {
    setIsGenerating(true);
    setError(null);

    try {
      console.log('Gerando anúncios Google para:', campaignData.companyName);

      // Forçar a linguagem para português, não deixar campo vazio ou genérico
      const language = "português brasileiro";
      
      // Adicionar informações específicas de contexto
      let extraContext = "";
      if (campaignData.industry) {
        extraContext += `Atua no setor de ${campaignData.industry}. `;
      }
      if (campaignData.product) {
        extraContext += `Oferece ${campaignData.product}. `;
      }
      if (campaignData.targetAudience) {
        extraContext += `Público-alvo: ${campaignData.targetAudience}. `;
      }

      // Criar o corpo da requisição com as informações completas e consistentes
      const requestBody = {
        platform: 'google',
        campaignData: {
          ...campaignData,
          extraContext,
          language,
          languageName: "português brasileiro",
          forcePortuguese: true,
          instructions: "RESPONDA APENAS EM PORTUGUÊS DO BRASIL. TODAS AS FRASES DEVEM ESTAR COMPLETAS.",
          brandTone: campaignData.brandTone || 'professional',
          callToAction: campaignData.callToAction || ['Saiba mais'],
          keywords: campaignData.keywords || [],
          platforms: ['google'],
        },
        temperature: 0.3,
      };

      console.log('Enviando request para generate-ads function:', JSON.stringify(requestBody, null, 2));

      const { data, error: apiError } = await supabase.functions.invoke('generate-ads', {
        body: requestBody,
      });

      if (apiError) {
        const message = apiError.message || 'Falha ao chamar função generate-ads';
        console.error('Erro na API gerando anúncios Google:', apiError);
        setError(message);
        toast({
          title: 'Erro na API',
          description: message,
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      if (!data?.success) {
        const message = data?.error || 'Falha ao gerar anúncios Google';
        console.error('Erro na função:', message);
        setError(message);
        toast({
          title: 'Falha na Geração',
          description: message,
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      console.log('🧪 Raw data da API:', data);

      let parsedAds;

      if (data.data) {
        if (typeof data.data === 'string') {
          try {
            console.log('🧪 Tentando analisar dados como string:', data.data.substring(0, 150) + '...');
            parsedAds = JSON.parse(data.data);
            console.log('🧪 JSON analisado com sucesso');
          } catch (parseError) {
            console.error('Erro ao analisar resposta JSON:', parseError);
            setError('Formato de resposta inválido');
            toast({
              title: 'Erro de Formato',
              description: 'Os anúncios gerados não estavam no formato correto.',
              variant: 'destructive',
            });
            setIsGenerating(false);
            return null;
          }
        } else if (Array.isArray(data.data)) {
          parsedAds = data.data;
        } else {
          console.error('Formato de dados inválido, esperado array ou string JSON:', typeof data.data);
          setError('Formato de resposta inválido');
          toast({
            title: 'Erro de Formato',
            description: 'Os anúncios gerados não estavam no formato correto.',
            variant: 'destructive',
          });
          setIsGenerating(false);
          return null;
        }
      } else {
        console.error('Nenhum dado retornado da API');
        setError('Nenhum dado retornado');
        toast({
          title: 'Resposta Vazia',
          description: 'O serviço não retornou dados de anúncios.',
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      if (!Array.isArray(parsedAds)) {
        console.error('Dados analisados não são um array:', parsedAds);
        setError('Formato de resposta inválido');
        toast({
          title: 'Erro de Formato',
          description: 'Os anúncios gerados não estavam no formato correto.',
          variant: 'destructive',
        });
        setIsGenerating(false);
        return null;
      }

      // Validação de qualidade - filtrar anúncios com problemas
      const validAds = parsedAds.filter((ad: any) => {
        // Verificar se tem dados básicos
        const hasRequiredFields = 
          (ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1) &&
          (ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2) &&
          (ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1);
          
        if (!hasRequiredFields) {
          console.warn("❌ Anúncio rejeitado por campos incompletos:", ad);
          return false;
        }
        
        // Verificar idioma e completude
        const headline1 = ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '';
        const headline2 = ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '';
        const desc1 = ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '';
        
        if (isEnglishText(headline1) || isEnglishText(headline2) || isEnglishText(desc1)) {
          console.warn("❌ Anúncio rejeitado por texto em inglês:", {headline1, headline2, desc1});
          return false;
        }
        
        return true;
      });
      
      if (validAds.length === 0) {
        // Fallback em caso de todos serem rejeitados
        console.error("❌ Todos os anúncios foram rejeitados na validação de qualidade");
        toast({
          title: "Falha na validação",
          description: "Todos os anúncios foram rejeitados por problemas de qualidade",
          variant: "destructive"
        });
        setIsGenerating(false);
        return null;
      }

      // Normalização dos campos esperando aliases possíveis, sempre em português
      const normalizedAds = validAds.map((ad: any) => {
        // Extrair valores com diferentes nomes possíveis
        const headline1 = ad.headline_1 || ad.headline1 || ad.headlineOne || ad.title1 || '';
        const headline2 = ad.headline_2 || ad.headline2 || ad.headlineTwo || ad.title2 || '';
        const headline3 = ad.headline_3 || ad.headline3 || ad.headlineThree || ad.title3 || '';
        const desc1 = ad.description_1 || ad.description1 || ad.descriptionOne || ad.desc1 || '';
        const desc2 = ad.description_2 || ad.description2 || ad.descriptionTwo || ad.desc2 || '';
        
        // Garantir que textos estejam completos e dentro dos limites
        return {
          headline1: completeText(headline1, 30),
          headline2: completeText(headline2, 30),
          headline3: completeText(headline3, 30),
          description1: completeText(desc1, 90),
          description2: completeText(desc2, 90),
          displayPath: ad.display_url || ad.displayPath || ad.displayUrl || 'exemplo.com',
          path1: ad.path1 || ad.path_1 || '',
          path2: ad.path2 || ad.path_2 || '',
          siteLinks: ad.siteLinks || ad.site_links || [],
        };
      });

      console.log('🧪 Anúncios Google normalizados e validados:', normalizedAds);
      if (normalizedAds.length > 0) {
        console.log('🧪 Exemplo de anúncio:', normalizedAds[0]);
      }

      setGoogleAds(normalizedAds);

      if (!normalizedAds || normalizedAds.length === 0) {
        toast({
          title: 'Nenhum Anúncio Gerado',
          description: 'Nenhum anúncio Google foi gerado a partir desta entrada.',
          variant: 'default',
        });
        setIsGenerating(false);
        return normalizedAds;
      }

      toast({
        title: 'Anúncios Gerados',
        description: `${normalizedAds.length} variações de anúncios Google geradas com sucesso.`,
      });

      setIsGenerating(false);
      return normalizedAds;
    } catch (error) {
      console.error('Erro ao gerar anúncios Google:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      toast({
        title: 'Falha na Geração',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
        variant: 'destructive',
      });
      setIsGenerating(false);
      return null;
    }
  };

  return {
    generateGoogleAds,
    isGenerating,
    googleAds,
    setGoogleAds,
    error,
  };
};
