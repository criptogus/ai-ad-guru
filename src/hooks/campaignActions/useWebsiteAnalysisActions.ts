
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { analyzeWebsite } from "@/services/campaign/websiteAnalysis";
import { errorLogger } from "@/services/libs/error-handling";
import { supabase } from "@/integrations/supabase/client";

export const useWebsiteAnalysisActions = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{fromCache?: boolean; cachedAt?: string; expiresAt?: string} | null>(null);
  
  // Get the current authenticated user
  const getUserId = async () => {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || 'anonymous';
  };
  
  // Properly implement the website analysis function
  const handleAnalyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    if (!url || !url.trim()) {
      toast({
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
      
      console.log('Calling analyze-website function with URL:', formattedUrl);
      
      const userId = await getUserId();
      
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
        
        toast({
          title: "Website Analysis",
          description: "Using cached analysis from previous scan",
        });
      } else {
        setCacheInfo(null);
        
        toast({
          title: "Website Analyzed",
          description: "Successfully analyzed website content",
        });
      }
      
      return result;
    } catch (error: any) {
      errorLogger.logError(error, 'handleAnalyzeWebsite');
      
      console.error('Error analyzing website:', error);
      
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive",
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
        
        toast({
          title: "Using Demo Data",
          description: "Using mock data while in development mode",
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
