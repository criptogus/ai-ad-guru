
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';

export interface AudienceAnalysisResult {
  success: boolean;
  platform?: string;
  analysisText: string;
  fromCache?: boolean;
  cachedAt?: string;
  language?: string;
  demographics?: any;
  interests?: any;
  painPoints?: any;
  decisionFactors?: any;
  marketSize?: any;
  competitors?: any;
  geolocation?: any;
}

export interface AudienceCacheInfo {
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

export const useAudienceAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AudienceAnalysisResult | null>(null);
  const [cacheInfo, setCacheInfo] = useState<AudienceCacheInfo | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeAudience = async (
    websiteData: WebsiteAnalysisResult,
    platform?: string
  ): Promise<AudienceAnalysisResult | null> => {
    // Clear states before starting a new analysis
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCacheInfo(null);
    setAnalysisError(null);
    
    try {
      if (!websiteData) {
        throw new Error("Website data is required for audience analysis");
      }

      const language = websiteData.language || 'en';
      console.log(`Analyzing audience for ${platform || 'all platforms'} using website: ${websiteData.websiteUrl || 'unknown'} in language: ${language}`);
      
      const { data, error } = await supabase.functions.invoke('analyze-audience', {
        body: { 
          websiteData, 
          platform,
          language
        }
      });

      if (error) {
        console.error('Error analyzing audience:', error);
        setAnalysisError(error.message || 'Failed to connect to audience analysis service');
        throw error;
      }

      // Validate the returned object
      if (!data || typeof data !== 'object') {
        const errorMsg = "Invalid response from audience analysis function";
        setAnalysisError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Check for API-level error
      if (!data.success) {
        const errorMsg = data.error || "API returned an error without details";
        setAnalysisError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('Audience analysis result:', data);
      
      // Validate that we have actual analysis text with detailed checks
      if (!data.data || typeof data.data !== 'string' || data.data.trim().length < 100) {
        const errorMsg = "OpenAI did not return a valid analysis (text too short or missing)";
        setAnalysisError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Verify if the text has the expected structure with more precise checking
      const expectedSections = [
        // Check for the existence of any of these headers in different languages
        ['PUBLIC TARGET PROFILE', 'PERFIL DO PÚBLICO-ALVO', 'PERFIL DETALLADO DEL PÚBLICO OBJETIVO'], 
        ['GEOLOCATION ANALYSIS', 'ANÁLISE DE GEOLOCALIZAÇÃO', 'GEOLOCALIZACIÓN ESTRATÉGICA'],
        ['MARKET ANALYSIS', 'ANÁLISE DE MERCADO', 'ANÁLISIS DE MERCADO'],
        ['COMPETITOR INSIGHTS', 'INSIGHTS DOS CONCORRENTES', 'ANÁLISIS COMPETITIVO', 'ANÁLISE COMPETITIVA']
      ];
      
      let hasValidStructure = false;
      const analysisText = data.data.toUpperCase();
      
      // Check if at least 2 of the expected sections are present
      const foundSections = expectedSections.filter(sectionVariants => 
        sectionVariants.some(header => analysisText.includes(header))
      );
      
      hasValidStructure = foundSections.length >= 2;
      
      if (!hasValidStructure) {
        const errorMsg = "OpenAI response does not contain the expected analysis structure";
        setAnalysisError(errorMsg);
        throw new Error(errorMsg);
      }
      
      // Include all structured fields returned from the API
      const processedData: AudienceAnalysisResult = {
        success: true,
        platform: platform || 'all',
        analysisText: data.data || "",
        fromCache: data.fromCache || false,
        cachedAt: data.cachedAt,
        language: language,
        // Include structured optional fields
        demographics: data.demographics,
        interests: data.interests,
        painPoints: data.painPoints,
        decisionFactors: data.decisionFactors,
        marketSize: data.marketSize,
        competitors: data.competitors,
        geolocation: data.geolocation
      };
      
      setAnalysisResult(processedData);
      
      // Check if data.fromCache and data.cachedAt exist before creating the Date object
      if (data.fromCache && data.cachedAt) {
        // Calculate expiration date (30 days after the cache date)
        const cachedAt = new Date(data.cachedAt);
        const expiresAt = new Date(cachedAt);
        expiresAt.setDate(expiresAt.getDate() + 30);

        setCacheInfo({
          fromCache: true,
          cachedAt: data.cachedAt,
          expiresAt: expiresAt.toISOString()
        });
        
        toast({
          title: "Usando análise em cache",
          description: "Utilizando dados de análise de público previamente analisados para este site",
        });
      } else {
        setCacheInfo({
          fromCache: false
        });
        
        toast({
          title: "Análise Completa",
          description: `Análise de público-alvo para ${platform || 'todas as plataformas'} concluída com sucesso`,
        });
      }
      
      return processedData;
    } catch (error: any) {
      console.error('Error in analyzeAudience:', error);
      setAnalysisError(error?.message || String(error) || "Failed to analyze audience");
      
      toast({
        title: "Falha na Análise",
        description: error?.message || String(error) || "Falha ao analisar o público-alvo. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeAudience,
    isAnalyzing,
    analysisResult,
    setAnalysisResult,
    cacheInfo,
    setCacheInfo,
    analysisError,
    setAnalysisError
  };
};
