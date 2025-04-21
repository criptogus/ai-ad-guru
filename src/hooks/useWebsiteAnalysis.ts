
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WebsiteAnalysisResult {
  companyName: string;
  companyDescription: string;
  businessDescription?: string;
  targetAudience: string;
  keywords: string[];
  industry?: string;
  logo?: string;
  colors?: string[];
  language?: string;
  websiteUrl?: string;
  brandTone?: string;
  uniqueSellingPoints?: string[];
  callToAction?: string[] | string;
}

export interface AnalysisCache {
  id: string;
  url: string;
  createdAt: string;
  updatedAt?: string;
  fromCache?: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [cacheInfo, setCacheInfo] = useState<AnalysisCache | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkCachedAnalysis = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    try {
      const { data, error } = await supabase
        .from('website_analysis_cache')
        .select('*')
        .eq('url', url)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error checking cache:", error);
        return null;
      }

      if (data) {
        console.log("Found cached analysis for URL:", url);
        setCacheInfo({
          id: data.id,
          url: data.url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          fromCache: true,
          cachedAt: data.created_at,
          expiresAt: data.expires_at
        });
        return data.analysis_result as WebsiteAnalysisResult;
      }

      return null;
    } catch (error) {
      console.error("Error in checkCachedAnalysis:", error);
      return null;
    }
  };

  const saveAnalysisToCache = async (url: string, result: WebsiteAnalysisResult): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('website_analysis_cache')
        .insert({
          url,
          analysis_result: result,
          language: result.language || 'pt-br'
        });

      if (error) {
        console.error("Error saving to cache:", error);
        return false;
      }

      console.log("Analysis saved to cache:", data);
      return true;
    } catch (error) {
      console.error("Error in saveAnalysisToCache:", error);
      return false;
    }
  };

  const analyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    if (!url) {
      setError("URL é obrigatória para análise");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // First check if we have a cached analysis
      const cachedResult = await checkCachedAnalysis(url);
      if (cachedResult) {
        // Ensure the websiteUrl property is set on the cached result
        const resultWithUrl = {
          ...cachedResult,
          websiteUrl: url
        };
        setAnalysisResult(resultWithUrl);
        
        // Show success toast for cached result
        toast.success("Análise concluída", {
          description: "Resultados carregados do cache"
        });
        return resultWithUrl;
      }

      console.log("Analyzing website:", url);
      
      // Invoke the Supabase Edge Function for website analysis
      const { data, error: functionError } = await supabase.functions.invoke('analyze-website', {
        body: { url, language: 'pt-br' }
      });
      
      if (functionError) {
        console.error("Error in analyze-website function:", functionError);
        throw new Error(functionError.message);
      }
      
      if (!data?.success) {
        throw new Error(data?.error || "Falha na análise do site");
      }
      
      const result = data.result as WebsiteAnalysisResult;
      
      // Ensure the websiteUrl property is set
      result.websiteUrl = url;
      
      // Ensure backwards compatibility with companyDescription/businessDescription
      if (result.companyDescription && !result.businessDescription) {
        result.businessDescription = result.companyDescription;
      } else if (result.businessDescription && !result.companyDescription) {
        result.companyDescription = result.businessDescription;
      }
      
      // Save to cache
      await saveAnalysisToCache(url, result);
      
      // Set the result
      setAnalysisResult(result);
      
      // Show success toast
      toast.success("Análise concluída", {
        description: "Site analisado com sucesso"
      });
      
      return result;
    } catch (err) {
      console.error("Error analyzing website:", err);
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido ocorrido";
      setError(errorMessage);
      
      toast.error("Falha na análise", {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analyzeWebsite,
    setAnalysisResult,
    analysisResult,
    isAnalyzing,
    error,
    cacheInfo
  };
};
