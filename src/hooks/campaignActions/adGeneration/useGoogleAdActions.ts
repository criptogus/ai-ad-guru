
import { useState } from 'react';
import { toast } from 'sonner';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd } from '@/hooks/adGeneration';
import { errorLogger } from '@/services/libs/error-handling';

export const useGoogleAdActions = (
  analysisResult: WebsiteAnalysisResult | null,
  googleAds: GoogleAd[],
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>,
  setCampaignData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast.error("Website analysis required before generating ads");
      return;
    }

    try {
      setIsGenerating(true);
      
      // Get the Google mind trigger from campaignData if available
      const mindTrigger = (window as any).campaignContext?.campaignData?.mindTriggers?.google || '';
      
      console.log("Generating Google ads with trigger:", mindTrigger);
      const generatedAds = await generateGoogleAds(analysisResult, mindTrigger);
      
      if (generatedAds) {
        // Create a consistent data structure with both individual fields and arrays
        const enrichedAds = generatedAds.map(ad => {
          return {
            ...ad,
            headline1: ad.headline1 || '',
            headline2: ad.headline2 || '',
            headline3: ad.headline3 || '',
            description1: ad.description1 || '',
            description2: ad.description2 || ''
          };
        });
        
        toast.success(`Generated ${enrichedAds.length} Google ad variations`);
        
        // Update campaign data with the new ads
        setCampaignData(prev => ({
          ...prev,
          googleAds: enrichedAds
        }));
      } else {
        // Generate fallback ads
        const fallbackAds = generateFallbackGoogleAds();
        setCampaignData(prev => ({
          ...prev,
          googleAds: fallbackAds
        }));
        
        toast.warning("Using fallback Google ads", {
          description: "Generated fallback ads due to API connection issues"
        });
      }
    } catch (error) {
      errorLogger.logError(error, "handleGenerateGoogleAds");
      console.error("Error generating Google ads:", error);
      
      // Generate fallback ads
      const fallbackAds = generateFallbackGoogleAds();
      setCampaignData(prev => ({
        ...prev,
        googleAds: fallbackAds
      }));
      
      toast.error("An error occurred while generating Google ads", {
        description: "Using fallback ad variations instead"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback ad generation for when the API fails
  const generateFallbackGoogleAds = (): GoogleAd[] => {
    const companyName = analysisResult?.companyName || "Company";
    const businessDesc = analysisResult?.businessDescription || "Quality service provider";
    
    // Create 5 fallback ads
    return [
      {
        headline1: `${companyName} - Official Site`,
        headline2: "Quality Solutions",
        headline3: "Expert Service",
        description1: `${businessDesc.substring(0, 80)}`,
        description2: "Contact Us Today for a Free Quote!",
        path1: "services",
        path2: "solutions"
      },
      {
        headline1: `Top Rated ${companyName}`,
        headline2: "Professional Services",
        headline3: "Save 15% Today",
        description1: `${businessDesc.substring(0, 80)}`,
        description2: "Trusted by Thousands of Satisfied Customers.",
        path1: "offers",
        path2: "discount"
      },
      {
        headline1: `${companyName} - #1 Choice`,
        headline2: "Fast & Reliable Service",
        headline3: "30-Day Guarantee",
        description1: `${businessDesc.substring(0, 80)}`,
        description2: "Free Consultation & Quick Response Time.",
        path1: "guarantee",
        path2: "service"
      },
      {
        headline1: `${companyName} Solutions`,
        headline2: "Premium Quality",
        headline3: "Available 24/7",
        description1: `${businessDesc.substring(0, 80)}`,
        description2: "Customized Solutions for Your Specific Needs.",
        path1: "premium",
        path2: "solutions"
      },
      {
        headline1: `Discover ${companyName}`,
        headline2: "Award-Winning Service",
        headline3: "Expert Team",
        description1: `${businessDesc.substring(0, 80)}`,
        description2: "Call Now for Exclusive Offers & Free Consultation.",
        path1: "experts",
        path2: "consultation"
      }
    ];
  };

  return {
    handleGenerateGoogleAds,
    isGenerating
  };
};
