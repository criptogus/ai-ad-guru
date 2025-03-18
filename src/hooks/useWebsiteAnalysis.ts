
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WebsiteAnalysisResult {
  companyName: string;
  businessDescription: string;
  targetAudience: string;
  brandTone: string;
  keywords: string[];
  callToAction: string[];
  uniqueSellingPoints: string[];
}

export const useWebsiteAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WebsiteAnalysisResult | null>(null);
  const { toast } = useToast();

  const analyzeWebsite = async (url: string) => {
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return null;
    }

    setIsAnalyzing(true);
    
    try {
      // Ensure URL has a protocol
      let formattedUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        formattedUrl = 'https://' + url;
      }
      
      // For demo/testing purposes, generate mock analysis data if the edge function fails
      try {
        const { data, error } = await supabase.functions.invoke('analyze-website', {
          body: { url: formattedUrl },
        });

        if (error) {
          console.error('Error analyzing website:', error);
          throw error;
        }

        if (!data.success) {
          console.error('Analysis failed:', data.error);
          throw new Error(data.error || "Failed to analyze website");
        }

        const result = data.data as WebsiteAnalysisResult;
        setAnalysisResult(result);
        
        toast({
          title: "Website Analyzed",
          description: "Successfully analyzed website content",
        });
        
        return result;
      } catch (error) {
        console.error('Error calling analyze-website function:', error);
        
        // Fallback to mock data for demo purposes
        const mockResult: WebsiteAnalysisResult = {
          companyName: extractDomainName(formattedUrl),
          businessDescription: "This is a demo analysis since we couldn't analyze the actual website.",
          targetAudience: "Professionals and businesses looking for innovative solutions.",
          brandTone: "Professional, helpful, and informative",
          keywords: ["innovation", "solutions", "professional", "technology", "service"],
          callToAction: ["Get Started Today", "Request a Demo", "Learn More"],
          uniqueSellingPoints: [
            "Innovative solutions tailored to your needs",
            "24/7 customer support and assistance",
            "Industry-leading technology and expertise"
          ]
        };
        
        setAnalysisResult(mockResult);
        
        toast({
          title: "Demo Analysis",
          description: "Using sample data since we couldn't connect to the analysis service",
          variant: "default",
        });
        
        return mockResult;
      }
    } catch (error) {
      console.error('Error analyzing website:', error);
      toast({
        title: "Analysis Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to extract domain name from URL
  const extractDomainName = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] === 'www') {
        return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
      }
      return parts[parts.length - 2].charAt(0).toUpperCase() + parts[parts.length - 2].slice(1);
    } catch {
      return "Company";
    }
  };

  return {
    analyzeWebsite,
    isAnalyzing,
    analysisResult,
  };
};
