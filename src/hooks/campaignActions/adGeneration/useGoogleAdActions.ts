import { useState } from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { toast } from "sonner";
import { errorLogger } from "@/services/libs/error-handling";

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast("Website analysis required", {
        description: "Please analyze a website before generating ads"
      });
      return;
    }

    try {
      setIsGenerating(true);

      // Get the mind trigger from the campaign data
      const mindTrigger = (window as any).campaignContext?.campaignData?.mindTriggers?.google || "";
      
      console.log("Generating Google ads with mind trigger:", mindTrigger);
      
      // Use fallback ads if the API call fails
      let ads = await generateGoogleAds(analysisResult, mindTrigger);
      
      if (!ads || ads.length === 0) {
        // Generate fallback ads if API fails
        console.log("Using fallback Google ads");
        ads = generateFallbackGoogleAds(analysisResult);
      }

      // Update campaign data with the generated ads
      setCampaignData((prev: any) => ({
        ...prev,
        googleAds: ads,
      }));

      toast("Google Ads Generated", {
        description: `${ads.length} ad variations created. 5 credits used.`
      });

    } catch (error) {
      errorLogger.logError(error, "handleGenerateGoogleAds");
      console.error("Error generating Google ads:", error);
      
      // Generate fallback ads if there was an error
      const fallbackAds = generateFallbackGoogleAds(analysisResult);
      
      setCampaignData((prev: any) => ({
        ...prev,
        googleAds: fallbackAds,
      }));
      
      toast("Used fallback ads", {
        description: "Generated fallback ads due to connection issues"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate fallback Google ads
  const generateFallbackGoogleAds = (analysisResult: WebsiteAnalysisResult | null): GoogleAd[] => {
    if (!analysisResult) return [];
    
    const { companyName, businessDescription, callToAction } = analysisResult;
    
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

  return {
    handleGenerateGoogleAds,
    isGenerating,
  };
};
