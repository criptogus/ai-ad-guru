
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { analyzeWebsite } from "@/services/campaign/websiteAnalysis";
import { errorLogger } from "@/services/libs/error-handling";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManager } from "@/hooks/useCreditsManager";
import { toast } from "sonner";

export const useWebsiteAnalysisActions = () => {
  const { toast: uiToast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{fromCache?: boolean; cachedAt?: string; expiresAt?: string} | null>(null);
  const { checkCreditBalance, consumeCredits } = useCreditsManager();
  
  // Get the current authenticated user
  const getUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || 'anonymous';
  };
  
  // Properly implement the website analysis function
  const handleAnalyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    if (!url || !url.trim()) {
      uiToast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return null;
    }

    // Check if user has enough credits for this action
    const userId = await getUserId();
    const creditsRequired = 2; // 2 credits for website analysis
    
    const hasEnoughCredits = await checkCreditBalance(creditsRequired);
    if (!hasEnoughCredits) {
      toast.error("Créditos insuficientes", {
        description: "Você precisa de 2 créditos para realizar a análise de website."
      });
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      // Format URL - ensure it has a protocol
      let formattedUrl = url.trim();
      
      // If URL doesn't have a protocol, add https://
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      console.log('Calling analyze-website function with URL:', formattedUrl);
      
      // Get data from cache first - this doesn't consume credits
      const { data: cacheData } = await supabase.functions.invoke('analyze-website', {
        body: { url: formattedUrl, checkCacheOnly: true }
      });
      
      if (cacheData?.fromCache) {
        console.log('Using cached analysis data');
        setCacheInfo({
          fromCache: true,
          cachedAt: cacheData.cachedAt,
          expiresAt: cacheData.expiresAt
        });
        
        uiToast({
          title: "Website Analysis",
          description: "Using cached analysis from previous scan",
        });
        
        return cacheData.data as WebsiteAnalysisResult;
      }
      
      // No cache available - consume credits before proceeding
      const creditConsumed = await consumeCredits(creditsRequired, "Website analysis");
      if (!creditConsumed) {
        toast.error("Erro ao debitar créditos", {
          description: "Não foi possível debitar os créditos necessários para esta operação."
        });
        return null;
      }
      
      // Perform the actual analysis
      const result = await analyzeWebsite({
        url: formattedUrl,
        userId
      });
      
      if (!result) {
        throw new Error("Failed to analyze website");
      }
      
      console.log('Analysis result:', result);
      
      // Store the website URL in the result if not already present
      if (!result.websiteUrl) {
        result.websiteUrl = formattedUrl;
      }
      
      // Check if the result came from cache
      if ((result as any).fromCache) {
        setCacheInfo({
          fromCache: true,
          cachedAt: (result as any).cachedAt,
          expiresAt: (result as any).expiresAt
        });
        
        uiToast({
          title: "Website Analysis",
          description: "Using cached analysis from previous scan",
        });
      } else {
        setCacheInfo(null);
        
        toast.success("Website Analyzed", {
          description: "Successfully analyzed website content"
        });
      }
      
      return result;
    } catch (error: any) {
      errorLogger.logError(error, 'handleAnalyzeWebsite');
      
      console.error('Error analyzing website:', error);
      
      toast.error("Analysis Failed", {
        description: error.message || "Failed to analyze website. Please try again.",
      });
      
      // Since we're in development, we'll simulate a successful response
      // only if we're in development mode
      if (import.meta.env.DEV) {
        console.log('Generating mock data for development');
        const mockResult: WebsiteAnalysisResult = {
          companyName: 'Example Company',
          companyDescription: 'Example Company provides innovative solutions for businesses in the technology sector.',
          businessDescription: 'Example Company provides innovative solutions for businesses in the technology sector.',
          targetAudience: 'Small to medium-sized technology companies',
          brandTone: 'Professional, innovative, trustworthy',
          keywords: ['innovation', 'technology', 'solutions', 'business'],
          callToAction: ['Contact us today', 'Schedule a demo', 'Learn more'],
          uniqueSellingPoints: [
            'Industry-leading technology',
            '24/7 customer support',
            'Customizable solutions'
          ],
          websiteUrl: url,
          industry: 'Technology'
        };
        
        toast.success("Using Demo Data", {
          description: "Using mock data while in development mode"
        });
        
        return mockResult;
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    handleAnalyzeWebsite,
    isAnalyzing,
    cacheInfo
  };
};
