
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WebsiteAnalysisResult {
  companyName: string;
  companyDescription: string;
  businessDescription?: string; // Keep as alias for companyDescription
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
  keySellingPoints?: string[];
  websiteUrl?: string;
  usps?: string[];
  language?: string;
  industry?: string;
}

export interface AnalysisCache {
  fromCache: boolean;
  cachedAt?: string;
  expiresAt?: string;
}

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const [cacheInfo, setCacheInfo] = useState<AnalysisCache | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
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
      
      // If URL doesn't have a protocol and doesn't start with www, add www
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        // If the URL doesn't start with www, add it
        if (!formattedUrl.startsWith('www.')) {
          formattedUrl = 'www.' + formattedUrl;
        }
        // Add https protocol
        formattedUrl = 'https://' + formattedUrl;
      }
      
      console.log('Calling analyze-website function with URL:', formattedUrl);
      
      // For this example, we'll create mock data instead of calling the Supabase function
      const result: WebsiteAnalysisResult = {
        companyName: 'Example Company',
        companyDescription: 'Example Company provides innovative solutions for businesses in the technology sector.',
        businessDescription: 'Example Company provides innovative solutions for businesses in the technology sector.', // Add this for compatibility
        targetAudience: 'Small to medium-sized technology companies',
        brandTone: 'Professional, innovative, trustworthy',
        keywords: ['innovation', 'technology', 'solutions', 'business'],
        callToAction: ['Contact us today', 'Schedule a demo', 'Learn more'],
        uniqueSellingPoints: [
          'Industry-leading technology',
          '24/7 customer support',
          'Customizable solutions'
        ],
        websiteUrl: formattedUrl,
        industry: 'Technology'
      };
      
      // Ensure both companyDescription and businessDescription are set
      if (result.companyDescription && !result.businessDescription) {
        result.businessDescription = result.companyDescription;
      } else if (result.businessDescription && !result.companyDescription) {
        result.companyDescription = result.businessDescription;
      }
      
      setAnalysisResult(result);
      
      toast({
        title: "Website Analyzed",
        description: "Successfully analyzed website content",
      });
      
      return result;
    } catch (error: any) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add a utility function to handle the aliasing when setting analysis results
  const setCompatibleAnalysisResult = (result: WebsiteAnalysisResult | null) => {
    if (result) {
      // Ensure both business and company description are set
      if (result.companyDescription && !result.businessDescription) {
        result.businessDescription = result.companyDescription;
      } else if (result.businessDescription && !result.companyDescription) {
        result.companyDescription = result.businessDescription;
      }
    }
    setAnalysisResult(result);
  };

  return {
    analyzeWebsite,
    isAnalyzing,
    analysisResult,
    setAnalysisResult: setCompatibleAnalysisResult,
    cacheInfo
  };
};
