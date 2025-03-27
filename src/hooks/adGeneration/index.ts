import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  GoogleAd, 
  MetaAd, 
  AdGenerationInput, 
  UseAdGenerationReturn 
} from './types';
import { useImageGeneration } from './useImageGeneration';

export const useAdGeneration = (): UseAdGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { generateAdImage } = useImageGeneration();

  // Improved utility function to clean object for JSON serialization
  // This version handles circular references
  const cleanObject = (obj: any) => {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      // Skip window/DOM nodes and any circular references
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        // Avoid processing DOM elements, window, etc.
        if (
          value instanceof Node || 
          value instanceof Window || 
          (typeof Window !== 'undefined' && value === Window) ||
          (typeof document !== 'undefined' && value === document)
        ) {
          return '[Object]';
        }
        seen.add(value);
      }
      return value;
    }));
  };

  // Generate Google Ads
  const generateGoogleAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<GoogleAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating Google Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      // Only include necessary properties to prevent circular references
      const simplifiedInput = {
        companyName: input.companyName,
        businessDescription: input.businessDescription,
        targetAudience: input.targetAudience,
        brandTone: input.brandTone,
        keywords: input.keywords,
        callToAction: input.callToAction,
        uniqueSellingPoints: input.uniqueSellingPoints,
        websiteUrl: input.websiteUrl
      };

      const request = {
        campaignData: simplifiedInput,
        platform: "google",
        mindTrigger
      };

      // Using try-catch to better handle edge function errors
      try {
        console.log("Sending request to generate-ads function:", JSON.stringify(request).substring(0, 150) + "...");
        
        const { data, error } = await supabase.functions.invoke('generate-ads', {
          body: request
        });

        if (error) {
          console.error("Error calling Edge Function generate-ads:", error);
          throw error;
        }

        if (!data || !data.success) {
          console.error("Function returned error:", data?.error || "Unknown error");
          throw new Error(data?.error || "Failed to generate ads");
        }

        console.log("Google ads generated:", data);
        
        // Post-process to ensure backward compatibility between headlines[] and headline1/2/3
        const processedAds = data.data.map((ad: any) => {
          const processedAd: GoogleAd = {
            headline1: '',
            headline2: '',
            headline3: '',
            description1: '',
            description2: '',
            headlines: [],
            descriptions: []
          };
          
          // Handle the case when we get headlines array
          if (ad.headlines && Array.isArray(ad.headlines)) {
            processedAd.headlines = [...ad.headlines];
            processedAd.headline1 = ad.headlines[0] || '';
            processedAd.headline2 = ad.headlines[1] || '';
            processedAd.headline3 = ad.headlines[2] || '';
          } 
          // Handle the case when we get individual headline properties
          else {
            processedAd.headline1 = ad.headline1 || '';
            processedAd.headline2 = ad.headline2 || '';
            processedAd.headline3 = ad.headline3 || '';
            processedAd.headlines = [
              processedAd.headline1,
              processedAd.headline2,
              processedAd.headline3
            ].filter(Boolean);
          }
          
          // Handle the case when we get descriptions array
          if (ad.descriptions && Array.isArray(ad.descriptions)) {
            processedAd.descriptions = [...ad.descriptions];
            processedAd.description1 = ad.descriptions[0] || '';
            processedAd.description2 = ad.descriptions[1] || '';
          } 
          // Handle the case when we get individual description properties
          else {
            processedAd.description1 = ad.description1 || '';
            processedAd.description2 = ad.description2 || '';
            processedAd.descriptions = [
              processedAd.description1,
              processedAd.description2
            ].filter(Boolean);
          }
          
          // Copy other properties
          if (ad.finalUrl) processedAd.finalUrl = ad.finalUrl;
          if (ad.path1) processedAd.path1 = ad.path1;
          if (ad.path2) processedAd.path2 = ad.path2;
          if (ad.displayPath) processedAd.displayPath = ad.displayPath;
          if (ad.siteLinks) processedAd.siteLinks = ad.siteLinks;
          
          return processedAd;
        });
        
        return processedAds;
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Edge function error: ${functionError.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in generateGoogleAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Google Ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Meta Ads (Instagram)
  const generateMetaAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<MetaAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating Meta Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      // Only include necessary properties to prevent circular references
      const simplifiedInput = {
        companyName: input.companyName,
        businessDescription: input.businessDescription,
        targetAudience: input.targetAudience,
        brandTone: input.brandTone,
        keywords: input.keywords,
        callToAction: input.callToAction,
        uniqueSellingPoints: input.uniqueSellingPoints,
        websiteUrl: input.websiteUrl
      };

      const request = {
        campaignData: simplifiedInput,
        platform: "meta",
        mindTrigger
      };

      // Using try-catch to better handle edge function errors
      try {
        console.log("Sending request to generate-ads function:", JSON.stringify(request).substring(0, 150) + "...");
        
        const { data, error } = await supabase.functions.invoke('generate-ads', {
          body: request
        });

        if (error) {
          console.error("Error calling Edge Function generate-ads:", error);
          throw error;
        }

        if (!data || !data.success) {
          console.error("Function returned error:", data?.error || "Unknown error");
          throw new Error(data?.error || "Failed to generate Meta ads");
        }

        console.log("Meta ads generated:", data);
        return data.data as MetaAd[];
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Edge function error: ${functionError.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in generateMetaAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Instagram/Meta Ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate LinkedIn Ads
  const generateLinkedInAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<MetaAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating LinkedIn Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      // Only include necessary properties to prevent circular references
      const simplifiedInput = {
        companyName: input.companyName,
        businessDescription: input.businessDescription,
        targetAudience: input.targetAudience,
        brandTone: input.brandTone,
        keywords: input.keywords,
        callToAction: input.callToAction,
        uniqueSellingPoints: input.uniqueSellingPoints,
        websiteUrl: input.websiteUrl
      };

      const request = {
        campaignData: simplifiedInput,
        platform: "linkedin",
        mindTrigger
      };

      // Using try-catch to better handle edge function errors
      try {
        console.log("Sending request to generate-ads function:", JSON.stringify(request).substring(0, 150) + "...");
        
        const { data, error } = await supabase.functions.invoke('generate-ads', {
          body: request
        });

        if (error) {
          console.error("Error calling Edge Function generate-ads:", error);
          throw error;
        }

        if (!data || !data.success) {
          console.error("Function returned error:", data?.error || "Unknown error");
          throw new Error(data?.error || "Failed to generate LinkedIn ads");
        }

        console.log("LinkedIn ads generated:", data);
        return data.data as MetaAd[];
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Edge function error: ${functionError.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in generateLinkedInAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate LinkedIn Ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Microsoft Ads
  const generateMicrosoftAds = async (input: AdGenerationInput, mindTrigger?: string): Promise<GoogleAd[] | null> => {
    setIsGenerating(true);
    
    try {
      console.log("Generating Microsoft Ads with input:", input);
      console.log("Using mind trigger:", mindTrigger || "None specified");

      // Only include necessary properties to prevent circular references
      const simplifiedInput = {
        companyName: input.companyName,
        businessDescription: input.businessDescription,
        targetAudience: input.targetAudience,
        brandTone: input.brandTone,
        keywords: input.keywords,
        callToAction: input.callToAction,
        uniqueSellingPoints: input.uniqueSellingPoints,
        websiteUrl: input.websiteUrl
      };

      const request = {
        campaignData: simplifiedInput,
        platform: "microsoft",
        mindTrigger
      };

      // Using try-catch to better handle edge function errors
      try {
        console.log("Sending request to generate-ads function:", JSON.stringify(request).substring(0, 150) + "...");
        
        const { data, error } = await supabase.functions.invoke('generate-ads', {
          body: request
        });

        if (error) {
          console.error("Error calling Edge Function generate-ads:", error);
          throw error;
        }

        if (!data || !data.success) {
          console.error("Function returned error:", data?.error || "Unknown error");
          throw new Error(data?.error || "Failed to generate Microsoft ads");
        }

        console.log("Microsoft ads generated:", data);
        
        // Process the ads
        const processedAds = data.data.map((ad: any) => {
          const processedAd: GoogleAd = {
            headline1: '',
            headline2: '',
            headline3: '',
            description1: '',
            description2: '',
            headlines: [],
            descriptions: []
          };
          
          // Handle the case when we get headlines array
          if (ad.headlines && Array.isArray(ad.headlines)) {
            processedAd.headlines = [...ad.headlines];
            processedAd.headline1 = ad.headlines[0] || '';
            processedAd.headline2 = ad.headlines[1] || '';
            processedAd.headline3 = ad.headlines[2] || '';
          } 
          // Handle the case when we get individual headline properties
          else {
            processedAd.headline1 = ad.headline1 || '';
            processedAd.headline2 = ad.headline2 || '';
            processedAd.headline3 = ad.headline3 || '';
            processedAd.headlines = [
              processedAd.headline1,
              processedAd.headline2,
              processedAd.headline3
            ].filter(Boolean);
          }
          
          // Handle the case when we get descriptions array
          if (ad.descriptions && Array.isArray(ad.descriptions)) {
            processedAd.descriptions = [...ad.descriptions];
            processedAd.description1 = ad.descriptions[0] || '';
            processedAd.description2 = ad.descriptions[1] || '';
          } 
          // Handle the case when we get individual description properties
          else {
            processedAd.description1 = ad.description1 || '';
            processedAd.description2 = ad.description2 || '';
            processedAd.descriptions = [
              processedAd.description1,
              processedAd.description2
            ].filter(Boolean);
          }
          
          // Copy other properties
          if (ad.finalUrl) processedAd.finalUrl = ad.finalUrl;
          if (ad.path1) processedAd.path1 = ad.path1;
          if (ad.path2) processedAd.path2 = ad.path2;
          if (ad.displayPath) processedAd.displayPath = ad.displayPath;
          if (ad.siteLinks) processedAd.siteLinks = ad.siteLinks;
          
          return processedAd;
        });
        
        return processedAds;
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        throw new Error(`Edge function error: ${functionError.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error in generateMicrosoftAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Microsoft Ads. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    isGenerating
  };
};

export * from './types';
