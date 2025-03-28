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
        
        // Generate fallback ads if API fails
        console.log("Using fallback Google ads generation");
        
        // This is where we'll use our fallback ad generation
        const fallbackAds = generateFallbackGoogleAds(input);
        return fallbackAds;
      }
    } catch (error) {
      console.error("Error in generateGoogleAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Google Ads",
        variant: "destructive",
      });
      
      // Use fallback ads as a last resort
      return generateFallbackGoogleAds(input);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback Google ad generation
  const generateFallbackGoogleAds = (input: AdGenerationInput): GoogleAd[] => {
    const { companyName, businessDescription, callToAction } = input;
    
    // Create 5 ad variations with the available data
    return [
      {
        headline1: `${companyName} | Professional Services`,
        headline2: "High-Quality Solutions",
        headline3: "Get Started Today",
        description1: businessDescription?.substring(0, 80) || "Transform your business with our professional services.",
        description2: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Contact us today!",
        headlines: [
          `${companyName} | Professional Services`,
          "High-Quality Solutions",
          "Get Started Today"
        ],
        descriptions: [
          businessDescription?.substring(0, 80) || "Transform your business with our professional services.",
          typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Contact us today!"
        ],
        path1: "services",
        path2: "professional"
      },
      {
        headline1: `Best ${companyName} Solutions`,
        headline2: "Expert Services & Support",
        headline3: "Start Your Journey",
        description1: businessDescription?.substring(0, 80) || "Discover how our services can help your business grow.",
        description2: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Learn more now!",
        headlines: [
          `Best ${companyName} Solutions`,
          "Expert Services & Support",
          "Start Your Journey"
        ],
        descriptions: [
          businessDescription?.substring(0, 80) || "Discover how our services can help your business grow.",
          typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Learn more now!"
        ],
        path1: "solutions",
        path2: "expert"
      },
      {
        headline1: `${companyName} - Trusted Provider`,
        headline2: "Quality Results Guaranteed",
        headline3: "Book a Consultation",
        description1: businessDescription?.substring(0, 80) || "Join our satisfied customers and experience the difference.",
        description2: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Get in touch now!",
        headlines: [
          `${companyName} - Trusted Provider`,
          "Quality Results Guaranteed",
          "Book a Consultation"
        ],
        descriptions: [
          businessDescription?.substring(0, 80) || "Join our satisfied customers and experience the difference.",
          typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Get in touch now!"
        ],
        path1: "consultation",
        path2: "trusted"
      },
      {
        headline1: `Transform with ${companyName}`,
        headline2: "Innovative Solutions",
        headline3: "See Results Fast",
        description1: businessDescription?.substring(0, 80) || "Our proven approach delivers the results you're looking for.",
        description2: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Request info today!",
        headlines: [
          `Transform with ${companyName}`,
          "Innovative Solutions",
          "See Results Fast"
        ],
        descriptions: [
          businessDescription?.substring(0, 80) || "Our proven approach delivers the results you're looking for.",
          typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Request info today!"
        ],
        path1: "transform",
        path2: "results"
      },
      {
        headline1: `${companyName} | Special Offer`,
        headline2: "Limited Time Opportunity",
        headline3: "Act Now & Save",
        description1: businessDescription?.substring(0, 80) || "Take advantage of our special promotional offer today.",
        description2: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Contact us for details!",
        headlines: [
          `${companyName} | Special Offer`,
          "Limited Time Opportunity",
          "Act Now & Save"
        ],
        descriptions: [
          businessDescription?.substring(0, 80) || "Take advantage of our special promotional offer today.",
          typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Contact us for details!"
        ],
        path1: "special",
        path2: "offer"
      }
    ];
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

        console.log("Meta ads generated:", data);
        return data.data;
      } catch (functionError) {
        console.error("Edge function error:", functionError);
        
        // Generate fallback ads if API fails
        console.log("Using fallback Meta ads generation");
        const fallbackAds = generateFallbackMetaAds(input);
        return fallbackAds;
      }
    } catch (error) {
      console.error("Error in generateMetaAds:", error);
      toast({
        title: "Ad Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate Meta Ads",
        variant: "destructive",
      });
      
      // Use fallback ads as a last resort
      return generateFallbackMetaAds(input);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback Meta ad generation
  const generateFallbackMetaAds = (input: AdGenerationInput): MetaAd[] => {
    const { companyName, businessDescription, callToAction, uniqueSellingPoints } = input;
    const sellingPoint = uniqueSellingPoints && uniqueSellingPoints.length > 0 
      ? uniqueSellingPoints[0] 
      : "Quality service you can trust";
    
    // Create 3 ad variations with the available data
    return [
      {
        headline: `Transform with ${companyName}`,
        primaryText: businessDescription || `Discover how ${companyName} can transform your experience with our professional services.`,
        description: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Learn More",
        imagePrompt: `Professional photo representing ${businessDescription?.substring(0, 100)}`,
        format: "feed"
      },
      {
        headline: `Experience ${companyName}`,
        primaryText: `${sellingPoint}. ${businessDescription?.substring(0, 100) || `At ${companyName}, we deliver exceptional results.`}`,
        description: typeof callToAction === 'string' ? callToAction : callToAction?.[1] || "Explore Now",
        imagePrompt: `Creative branded image for ${companyName}`,
        format: "feed"
      },
      {
        headline: `${companyName} - Your Solution`,
        primaryText: businessDescription || `Looking for the best? ${companyName} delivers results that exceed expectations every time.`,
        description: typeof callToAction === 'string' ? callToAction : callToAction?.[0] || "Contact Us",
        imagePrompt: `Professional ${companyName} service image`,
        format: "feed"
      }
    ];
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

  // Generate ad image
  const generateImage = async (prompt: string, platform: string = 'meta'): Promise<string | null> => {
    try {
      return await generateAdImage(prompt, platform);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image Generation Failed",
        description: "Could not generate the requested image. Using a placeholder instead.",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    isGenerating,
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateImage
  };
};

export * from './types';
