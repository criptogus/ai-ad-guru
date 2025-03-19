
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

export const useWebsiteAnalysisActions = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Properly implement the website analysis function
  const handleAnalyzeWebsite = async (url: string): Promise<WebsiteAnalysisResult | null> => {
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
      
      console.log('Calling analyze-website function with URL:', formattedUrl);
      
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

      console.log('Analysis result:', data.data);
      const result = data.data as WebsiteAnalysisResult;
      
      // Store the website URL in the result
      result.websiteUrl = formattedUrl;
      
      toast({
        title: "Website Analyzed",
        description: "Successfully analyzed website content",
      });
      
      return result;
    } catch (error) {
      console.error('Error calling analyze-website function:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze website. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    handleAnalyzeWebsite,
    isAnalyzing
  };
};

