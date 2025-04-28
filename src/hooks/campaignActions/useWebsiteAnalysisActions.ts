
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { analyzeWebsite } from "@/services/campaign/websiteAnalysis";
import { errorLogger } from "@/services/libs/error-handling";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManager } from "@/hooks/useCreditsManager";
import { toast } from "sonner";
import { OpenAICacheService } from "@/services/credits/openaiCache";

export const useWebsiteAnalysisActions = () => {
  const { toast: uiToast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{fromCache?: boolean; cachedAt?: string; expiresAt?: string} | null>(null);
  const { checkCreditBalance, consumeCredits } = useCreditsManager();
  
  // Get the current authenticated user
  const getUserId = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Auth error:", error);
        errorLogger.logError(error, 'useWebsiteAnalysisActions.getUserId');
        throw new Error(`Authentication error: ${error.message}`);
      }
      
      if (!data?.user?.id) {
        console.error("No authenticated user found");
        const authError = new Error("Authentication required");
        errorLogger.logError(authError, 'useWebsiteAnalysisActions.getUserId');
        throw authError;
      }
      return data.user.id;
    } catch (error) {
      console.error("Error getting authenticated user:", error);
      errorLogger.logError(error, 'useWebsiteAnalysisActions.getUserId');
      throw error;
    }
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

    setIsAnalyzing(true);
    
    try {
      // Format URL - ensure it has a protocol
      let formattedUrl = url.trim();
      
      // If URL doesn't have a protocol, add https://
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      // Get the authenticated user ID
      let userId;
      try {
        userId = await getUserId();
        console.log('Authenticated user ID for credit deduction:', userId);
      } catch (authError) {
        console.error('Authentication error:', authError);
        uiToast({
          title: "Authentication Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return null;
      }
      
      // Prepare the analysis parameters
      const analysisParams = {
        url: formattedUrl,
        userId
      };
      
      // Check if we have a cached analysis
      const hasCachedAnalysis = await OpenAICacheService.hasCachedResponse(analysisParams);
      console.log('Has cached analysis:', hasCachedAnalysis);
      
      // If cached, we don't need to deduct credits
      if (hasCachedAnalysis) {
        console.log('Using cached analysis - no credits will be deducted');
        uiToast({
          title: "Website Analysis",
          description: "Using cached analysis from previous scan",
        });
      } else {
        // Check if user has enough credits for this action
        const creditsRequired = 2; // 2 credits for website analysis
        let hasEnoughCredits;
        try {
          hasEnoughCredits = await checkCreditBalance(creditsRequired);
        } catch (creditCheckError) {
          console.error("Error checking credit balance:", creditCheckError);
          errorLogger.logError(creditCheckError, 'useWebsiteAnalysisActions.handleAnalyzeWebsite.creditCheck');
          toast.error("Erro ao verificar créditos", {
            description: "Não foi possível verificar seu saldo de créditos."
          });
          setIsAnalyzing(false);
          return null;
        }
        
        if (!hasEnoughCredits) {
          toast.error("Créditos insuficientes", {
            description: "Você precisa de 2 créditos para realizar a análise de website."
          });
          setIsAnalyzing(false);
          return null;
        }
        
        console.log(`User ${userId} has enough credits for analysis. Required: ${creditsRequired}`);
      }
      
      // Define the credit deduction function
      const deductCreditsFunction = async () => {
        // Skip deduction if we're using cached results
        if (hasCachedAnalysis) {
          return true;
        }
        
        // Otherwise deduct credits
        const creditsRequired = 2;
        try {
          const creditConsumed = await consumeCredits(creditsRequired, "Website analysis");
          if (!creditConsumed) {
            console.error("Failed to deduct credits for website analysis");
            errorLogger.logError(new Error("Credit deduction failed"), 'useWebsiteAnalysisActions.deductCreditsFunction');
            toast.error("Erro ao debitar créditos", {
              description: "Não foi possível debitar os créditos necessários para esta operação."
            });
            return false;
          }
          console.log(`Successfully deducted ${creditsRequired} credits for website analysis`);
          return true;
        } catch (error) {
          console.error("Error deducting credits:", error);
          errorLogger.logError({
            error,
            userId,
            creditsRequired,
            operation: "website_analysis"
          }, 'useWebsiteAnalysisActions.deductCreditsFunction');
          throw new Error(`Failed to deduct credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      
      // Perform the actual analysis with caching logic
      console.log('Calling analyze-website function with URL:', formattedUrl);
      
      try {
        // Try to deduct credits first if not using cache
        if (!hasCachedAnalysis) {
          const deductionSuccessful = await deductCreditsFunction();
          if (!deductionSuccessful) {
            setIsAnalyzing(false);
            return null;
          }
        }
        
        const result = await analyzeWebsite(analysisParams);
        
        if (!result) {
          throw new Error("Failed to analyze website - no result returned");
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
      } catch (analysisError) {
        console.error("Error in website analysis:", analysisError);
        errorLogger.logError(analysisError, 'useWebsiteAnalysisActions.handleAnalyzeWebsite.analysis');
        
        throw analysisError;
      }
      
    } catch (error: any) {
      errorLogger.logError(error, 'handleAnalyzeWebsite');
      
      console.error('Error analyzing website:', error);
      console.error('Detailed error:', error?.response?.data, error?.message);
      
      toast.error("Analysis Failed", {
        description: error?.message || "Failed to analyze website. Please try again.",
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
          industry: 'Technology',
          language: 'en'
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
