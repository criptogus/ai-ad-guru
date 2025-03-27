import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCampaign } from "@/contexts/CampaignContext";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration, GoogleAd, MetaAd } from "@/hooks/adGeneration";
import { useToast } from "@/hooks/use-toast";
import useSupabase from "@/hooks/useSupabase";
import { useAuth } from "@/contexts/AuthContext";
import CampaignHeader from "./CampaignHeader";
import StepIndicator from "./StepIndicator";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";

const CampaignContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supabase = useSupabase();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{ fromCache: boolean; cachedAt?: string } | null>(null);

  const {
    currentStep,
    setCurrentStep,
    campaignData,
    setCampaignData,
    analysisResult,
    setAnalysisResult,
    googleAds,
    setGoogleAds,
    metaAds,
    setMetaAds,
    microsoftAds,
    setMicrosoftAds,
    linkedInAds,
    setLinkedInAds,
  } = useCampaign();

  const {
    generateGoogleAds,
    generateMetaAds,
    generateLinkedInAds,
    generateMicrosoftAds,
    generateAdImage,
    isGenerating,
  } = useAdGeneration();

  const getStepTitles = () => [
    "Website Analysis",
    "Platform Selection",
    "Mind Triggers",
    "Campaign Setup",
    "Ad Preview",
    "Review & Create",
  ];

  const handleWebsiteAnalysis = async (websiteUrl: string): Promise<WebsiteAnalysisResult | null> => {
    try {
      setIsAnalyzing(true);
      const { data, error } = await supabase.functions.invoke("analyze-website", {
        body: { url: websiteUrl },
      });

      if (error) {
        console.error("Error analyzing website:", error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze website. Please check the URL and try again.",
          variant: "destructive",
        });
        return null;
      }

      if (!data.success) {
        console.error("Analysis failed:", data.error);
        toast({
          title: "Analysis Failed",
          description: data.error || "Failed to analyze website. Please check the URL and try again.",
          variant: "destructive",
        });
        return null;
      }

      if (data.fromCache) {
        setCacheInfo({
          fromCache: true,
          cachedAt: data.cachedAt
        });
        
        toast({
          title: "Using Cached Analysis",
          description: "Using previously analyzed data for this website",
        });
      } else {
        setCacheInfo({
          fromCache: false
        });
        
        toast({
          title: "Website Analyzed",
          description: "Successfully analyzed website content",
        });
      }

      const result = {
        ...data.data,
        websiteUrl,
      };

      setAnalysisResult(result);
      return result;
    } catch (error) {
      console.error("Error in handleWebsiteAnalysis:", error);
      toast({
        title: "Analysis Failed",
        description: "An unexpected error occurred during analysis. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateGoogleAds = async (): Promise<void> => {
    if (!analysisResult) return;
    
    try {
      const mindTrigger = campaignData.mindTriggers?.google;
      const result = await generateGoogleAds({
        ...analysisResult,
        ...campaignData,
      }, mindTrigger);
      
      if (result) {
        setGoogleAds(result);
      }
    } catch (error) {
      console.error("Error generating Google Ads:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Google Ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMetaAds = async (): Promise<void> => {
    if (!analysisResult) return;
    
    try {
      const mindTrigger = campaignData.mindTriggers?.meta;
      const result = await generateMetaAds({
        ...analysisResult,
        ...campaignData,
      }, mindTrigger);
      
      if (result) {
        setMetaAds(result);
      }
    } catch (error) {
      console.error("Error generating Meta Ads:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Instagram Ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMicrosoftAds = async (): Promise<void> => {
    if (!analysisResult) return;
    
    try {
      const mindTrigger = campaignData.mindTriggers?.microsoft;
      const result = await generateMicrosoftAds({
        ...analysisResult,
        ...campaignData,
      }, mindTrigger);
      
      if (result) {
        setMicrosoftAds(result);
      }
    } catch (error) {
      console.error("Error generating Microsoft Ads:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate Microsoft Ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateLinkedInAds = async (): Promise<void> => {
    if (!analysisResult) return;
    
    try {
      const mindTrigger = campaignData.mindTriggers?.linkedin;
      const result = await generateLinkedInAds({
        ...analysisResult,
        ...campaignData,
      }, mindTrigger);
      
      if (result) {
        setLinkedInAds(result);
      }
    } catch (error) {
      console.error("Error generating LinkedIn Ads:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate LinkedIn Ads. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    if (!ad.imagePrompt) {
      toast({
        title: "Missing Prompt",
        description: "Image prompt is required to generate an image",
        variant: "destructive",
      });
      return;
    }

    setLoadingImageIndex(index);

    try {
      const imageUrl = await generateAdImage(ad.imagePrompt, {
        platform: "instagram",
        format: ad.format || "feed",
        companyName: analysisResult?.companyName,
        brandTone: analysisResult?.brandTone,
      });

      if (imageUrl) {
        const updatedAd = { ...ad, imageUrl };
        const updatedAds = [...metaAds];
        updatedAds[index] = updatedAd;
        setMetaAds(updatedAds);
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingImageIndex(null);
    }
  };

  const handleUpdateGoogleAd = (index: number, updatedAd: GoogleAd): void => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setGoogleAds(updatedAds);
  };

  const handleUpdateMetaAd = (index: number, updatedAd: MetaAd): void => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setMetaAds(updatedAds);
  };

  const handleUpdateMicrosoftAd = (index: number, updatedAd: any): void => {
    const updatedAds = [...microsoftAds];
    updatedAds[index] = updatedAd;
    setMicrosoftAds(updatedAds);
  };

  const handleUpdateLinkedInAd = (index: number, updatedAd: MetaAd): void => {
    const updatedAds = [...linkedInAds];
    updatedAds[index] = updatedAd;
    setLinkedInAds(updatedAds);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNextWrapper = (data?: any) => {
    if (data) {
      setCampaignData({
        ...campaignData,
        ...data,
      });
    }
    handleNext();
  };

  const createCampaign = async (): Promise<void> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a campaign",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const adData = {
        googleAds,
        metaAds,
        microsoftAds,
        linkedInAds,
      };

      const { data, error } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.id,
          name: campaignData.name,
          description: campaignData.description,
          platform: campaignData.platforms?.join(","),
          status: "draft",
          website_url: analysisResult?.websiteUrl,
          target_audience: campaignData.targetAudience,
          objective: campaignData.objective,
          budget: campaignData.budget,
          budget_type: campaignData.budgetType,
          start_date: campaignData.startDate,
          end_date: campaignData.endDate,
          mind_triggers: campaignData.mindTriggers,
          ads_data: adData,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully",
      });

      navigate(`/campaigns/${data.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const { getStepContent } = useCampaignStepRenderer({
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    microsoftAds,
    linkedInAds,
    isAnalyzing,
    isGenerating,
    loadingImageIndex,
    isCreating,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateLinkedInAds,
    handleGenerateImage,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign,
    cacheInfo,
  });

  const stepTitles = getStepTitles();

  return (
    <div className="space-y-6">
      <CampaignHeader onBack={handleBack} />
      <StepIndicator 
        steps={stepTitles} 
        currentStepIndex={currentStep} 
        onStepClick={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />
      {getStepContent()}
    </div>
  );
};

export default CampaignContent;
