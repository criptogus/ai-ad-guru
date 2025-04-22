
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WebsiteAnalysisResult } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';

interface UseAdGenerationHandlersProps {
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  setGoogleAds: React.Dispatch<React.SetStateAction<GoogleAd[]>>;
  setMetaAds: React.Dispatch<React.SetStateAction<MetaAd[]>>;
  setLinkedInAds: React.Dispatch<React.SetStateAction<any[]>>;
  setMicrosoftAds: React.Dispatch<React.SetStateAction<any[]>>;
  createCampaign: any;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  generateGoogleAds: (campaignData: any) => Promise<GoogleAd[] | null>;
  generateMetaAds: (campaignData: any) => Promise<MetaAd[] | null>;
  generateLinkedInAds: (campaignData: any) => Promise<any[] | null>;
  generateMicrosoftAds: (campaignData: any) => Promise<any[] | null>;
}

export const useAdGenerationHandlers = ({
  analysisResult,
  campaignData,
  setGoogleAds,
  setMetaAds,
  setLinkedInAds,
  setMicrosoftAds,
  createCampaign,
  setIsCreating,
  generateGoogleAds,
  generateMetaAds,
  generateLinkedInAds,
  generateMicrosoftAds
}: UseAdGenerationHandlersProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();

  // Generate fallback ads when API fails
  const generateFallbackAds = (platform: string) => {
    const companyName = campaignData.companyName || analysisResult?.companyName || 'Your Company';
    
    if (platform === 'google' || platform === 'microsoft') {
      return Array(5).fill(null).map((_, i) => ({
        headline_1: `${companyName} - Professional Services`,
        headline_2: `Quality Solutions for Your Needs`,
        headline_3: `Contact Us Today`,
        description_1: `We provide top-quality services designed for your specific requirements.`,
        description_2: `Learn more about how we can help your business grow and succeed.`,
        display_url: campaignData.targetUrl || campaignData.websiteUrl || 'example.com'
      }));
    } else if (platform === 'meta' || platform === 'linkedin') {
      return Array(5).fill(null).map((_, i) => ({
        headline: `${companyName} - Professional Services`,
        primaryText: `Discover how our solutions can transform your business. Our team of experts is ready to help you achieve your goals.`,
        description: `Quality services tailored to your needs. Contact us today to learn more.`,
        imagePrompt: `Professional business image for ${companyName}, showing ${campaignData.industry || 'professional'} environment`,
        format: 'square'
      }));
    }
    
    return [];
  };

  // Handler for all ads generated from AdGenerationStep component
  const handleAdsGenerated = (adsData: Record<string, any[]>) => {
    console.log("Handling generated ads:", adsData);
    
    // Process the ads by platform
    if (adsData.google && Array.isArray(adsData.google)) {
      setGoogleAds(adsData.google);
    }
    
    if (adsData.meta && Array.isArray(adsData.meta)) {
      setMetaAds(adsData.meta);
    }
    
    if (adsData.linkedin && Array.isArray(adsData.linkedin)) {
      setLinkedInAds(adsData.linkedin);
    }
    
    if (adsData.microsoft && Array.isArray(adsData.microsoft)) {
      setMicrosoftAds(adsData.microsoft);
    }
    
    toast({
      title: "Ad Generation Complete",
      description: `Ads generated for ${Object.keys(adsData).length} platforms.`
    });
  };

  // Individual platform ad generation handlers
  const handleGenerateGoogleAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Google Ads",
        description: "Creating 5 new ad variations"
      });
      
      const mindTrigger = campaignData.mindTriggers?.google || '';
      let ads = await generateGoogleAds({
        ...campaignData, 
        mindTrigger,
        platforms: ['google']
      });
      
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        ads = generateFallbackAds('google');
        toast({
          variant: "warning",
          title: "Using fallback Google Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "Google Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      setGoogleAds(ads);
    } catch (error) {
      console.error("Failed to generate Google Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackAds('google');
      setGoogleAds(fallbackAds);
      
      toast({
        variant: "warning",
        title: "Using fallback Google Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Similar handlers for Meta, LinkedIn, and Microsoft ads
  const handleGenerateMetaAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Instagram Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.meta || '';
      let ads = await generateMetaAds({
        ...campaignData,
        mindTrigger,
        platforms: ['meta']
      });
  
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        ads = generateFallbackAds('meta');
        toast({
          variant: "warning",
          title: "Using fallback Instagram Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "Instagram Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      setMetaAds(ads);
    } catch (error) {
      console.error("Failed to generate Instagram Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackAds('meta');
      setMetaAds(fallbackAds);
      
      toast({
        variant: "warning",
        title: "Using fallback Instagram Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLinkedInAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating LinkedIn Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.linkedin || '';
      let ads = await generateLinkedInAds({
        ...campaignData,
        mindTrigger,
        platforms: ['linkedin']
      });
  
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        ads = generateFallbackAds('linkedin');
        toast({
          variant: "warning",
          title: "Using fallback LinkedIn Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "LinkedIn Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      setLinkedInAds(ads);
    } catch (error) {
      console.error("Failed to generate LinkedIn Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackAds('linkedin');
      setLinkedInAds(fallbackAds);
      
      toast({
        variant: "warning",
        title: "Using fallback LinkedIn Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMicrosoftAds = async () => {
    try {
      setIsGenerating(true);
      toast({
        title: "Generating Microsoft Ads",
        description: "Creating 5 new ad variations"
      });
  
      const mindTrigger = campaignData.mindTriggers?.microsoft || '';
      let ads = await generateMicrosoftAds({
        ...campaignData,
        mindTrigger,
        platforms: ['microsoft']
      });
  
      // Use fallback if generation fails
      if (!ads || ads.length === 0) {
        ads = generateFallbackAds('microsoft');
        toast({
          variant: "warning",
          title: "Using fallback Microsoft Ads",
          description: "We've created placeholder ads. You can edit them now."
        });
      } else {
        toast({
          title: "Microsoft Ads Generated",
          description: `Created ${ads.length} ad variations`
        });
      }
      
      setMicrosoftAds(ads);
    } catch (error) {
      console.error("Failed to generate Microsoft Ads:", error);
      // Use fallback on error
      const fallbackAds = generateFallbackAds('microsoft');
      setMicrosoftAds(fallbackAds);
      
      toast({
        variant: "warning",
        title: "Using fallback Microsoft Ads",
        description: "We've created placeholder ads due to an error. You can edit them now."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    handleAdsGenerated,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateLinkedInAds,
    handleGenerateMicrosoftAds,
    isGenerating
  };
};
