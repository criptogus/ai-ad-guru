
import { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useToast } from "@/hooks/use-toast";

interface UseGoogleAdActionsProps {
  analysisResult: WebsiteAnalysisResult | null;
  googleAds: GoogleAd[];
  generateGoogleAds: (campaignData: any, mindTrigger?: string) => Promise<GoogleAd[] | null>;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
}

export const useGoogleAdActions = ({
  analysisResult,
  googleAds,
  generateGoogleAds,
  setCampaignData
}: UseGoogleAdActionsProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) {
      toast({
        title: "No Analysis Result",
        description: "Please analyze a website first to generate ads.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate ads using the analysis result
      const ads = await generateGoogleAds(analysisResult);

      if (ads && ads.length > 0) {
        // Show success message
        toast({
          title: "Google Ads Generated",
          description: `Successfully generated ${ads.length} Google Ads.`,
        });

        // Update campaign data with the Google ads
        setCampaignData(prevData => ({
          ...prevData,
          googleAds: ads
        }));
      } else {
        // Show error message
        toast({
          title: "Generation Failed",
          description: "Failed to generate Google Ads. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating Google Ads:", error);
      toast({
        title: "Error",
        description: "An error occurred while generating ads. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Mocked Google ad examples for testing or fallback
  const mockGoogleAds: GoogleAd[] = [
    {
      headline1: "Professional Web Solutions",
      headline2: "Tailored for Your Business",
      headline3: "Get Started Today",
      description1: "Expert web development services to boost your online presence.",
      description2: "Custom solutions for all your web needs.",
      path1: "services",
      path2: "web-dev",
      headlines: ["Professional Web Solutions", "Tailored for Your Business", "Get Started Today"],
      descriptions: ["Expert web development services to boost your online presence.", "Custom solutions for all your web needs."]
    },
    {
      headline1: "Custom Website Design",
      headline2: "Professional & Affordable",
      headline3: "Free Consultation",
      description1: "Stunning websites that capture your brand essence.",
      description2: "Responsive designs that work on all devices.",
      path1: "design",
      path2: "websites",
      headlines: ["Custom Website Design", "Professional & Affordable", "Free Consultation"],
      descriptions: ["Stunning websites that capture your brand essence.", "Responsive designs that work on all devices."]
    },
    {
      headline1: "E-commerce Solutions",
      headline2: "Boost Your Online Sales",
      headline3: "Start Selling Today",
      description1: "Powerful online stores with secure payment processing.",
      description2: "Optimize your customer journey for better conversions.",
      path1: "ecommerce",
      path2: "solutions",
      headlines: ["E-commerce Solutions", "Boost Your Online Sales", "Start Selling Today"],
      descriptions: ["Powerful online stores with secure payment processing.", "Optimize your customer journey for better conversions."]
    },
    {
      headline1: "Mobile-First Web Design",
      headline2: "Responsive & Fast Loading",
      headline3: "Improve SEO Now",
      description1: "Websites optimized for all screen sizes and devices.",
      description2: "Fast-loading pages that keep visitors engaged.",
      path1: "mobile",
      path2: "design",
      headlines: ["Mobile-First Web Design", "Responsive & Fast Loading", "Improve SEO Now"],
      descriptions: ["Websites optimized for all screen sizes and devices.", "Fast-loading pages that keep visitors engaged."]
    },
    {
      headline1: "Web Performance Experts",
      headline2: "Speed Up Your Website",
      headline3: "Better User Experience",
      description1: "Optimize loading times and improve core web vitals.",
      description2: "Better performance leads to better conversion rates.",
      path1: "performance",
      path2: "optimization",
      headlines: ["Web Performance Experts", "Speed Up Your Website", "Better User Experience"],
      descriptions: ["Optimize loading times and improve core web vitals.", "Better performance leads to better conversion rates."]
    }
  ];

  return {
    handleGenerateGoogleAds,
    isGenerating,
    mockGoogleAds
  };
};
