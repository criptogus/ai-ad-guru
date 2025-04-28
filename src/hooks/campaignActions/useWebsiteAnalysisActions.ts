
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { analyzeWebsite } from "@/services/campaign/websiteAnalysis";
import { errorLogger } from "@/services/libs/error-handling";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManager } from "@/hooks/useCreditsManager";
import { toast } from "sonner";
import { OpenAICacheService } from "@/services/credits/openaiCache";
import { CreditTransactionManager } from "@/services/credits/transactionManager";

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
          // Use the more robust credit check function
          const creditCheck = await CreditTransactionManager.checkCredits(userId, creditsRequired);
          hasEnoughCredits = creditCheck.hasEnough;
          
          if (!hasEnoughCredits) {
            toast.error("Insufficient credits", {
              description: `You need ${creditsRequired} credits for website analysis. You have ${creditCheck.current} credits.`
            });
            setIsAnalyzing(false);
            return null;
          }
        } catch (creditCheckError) {
          console.error("Error checking credit balance:", creditCheckError);
          errorLogger.logError({
            error: creditCheckError,
            userId,
            creditsRequired,
            operation: "website_analysis_credit_check"
          }, 'useWebsiteAnalysisActions.handleAnalyzeWebsite.creditCheck');
          
          toast.error("Error checking credits", {
            description: creditCheckError instanceof Error 
              ? creditCheckError.message 
              : "Failed to verify your credit balance"
          });
          setIsAnalyzing(false);
          return null;
        }
        
        console.log(`User ${userId} has enough credits for analysis. Required: ${creditsRequired}`);
      }
      
      // Define the credit deduction function with improved error handling
      const deductCreditsFunction = async () => {
        // Skip deduction if we're using cached results
        if (hasCachedAnalysis) {
          return true;
        }
        
        // Otherwise deduct credits
        const creditsRequired = 2;
        try {
          // Use the more robust transaction manager
          const result = await CreditTransactionManager.deductCredits({
            userId,
            amount: creditsRequired,
            action: "website_analysis", 
            metadata: { url: formattedUrl }
          });
          
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
          
          toast.error("Error deducting credits", {
            description: error instanceof Error 
              ? error.message 
              : "Failed to deduct credits for this operation"
          });
          
          return false;
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
          
          // If this is a new analysis, let's cache it for future use
          try {
            await OpenAICacheService.cacheResponse(analysisParams, result);
            console.log('Analysis result cached successfully');
          } catch (cacheError) {
            console.error('Failed to cache analysis result:', cacheError);
            // Non-critical error, just log it
            errorLogger.logWarning('Failed to cache website analysis', 
              'useWebsiteAnalysisActions.handleAnalyzeWebsite.cacheResult');
          }
          
          toast.success("Website Analyzed", {
            description: "Successfully analyzed website content"
          });
        }
        
        return result;
      } catch (analysisError) {
        console.error("Error in website analysis:", analysisError);
        errorLogger.logError({
          error: analysisError,
          url: formattedUrl,
          userId,
          operation: "website_analysis_processing"
        }, 'useWebsiteAnalysisActions.handleAnalyzeWebsite.analysis');
        
        // If we already deducted credits but analysis failed, let's refund them
        if (!hasCachedAnalysis) {
          try {
            await CreditTransactionManager.refundCredits({
              userId,
              amount: 2, // Refund the 2 credits we deducted
              action: "website_analysis_refund",
              metadata: { reason: "analysis_failed", url: formattedUrl }
            });
            console.log('Credits refunded due to analysis failure');
          } catch (refundError) {
            console.error('Failed to refund credits:', refundError);
            errorLogger.logError(refundError, 'useWebsiteAnalysisActions.handleAnalyzeWebsite.refund');
          }
        }
        
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
