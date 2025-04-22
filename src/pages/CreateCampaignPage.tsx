import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWebsiteAnalysis } from "@/hooks/useWebsiteAnalysis";
import { useCampaignState } from "@/hooks/useCampaignState";
import { Stepper } from "@/components/campaign/Stepper";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { CampaignProvider } from "@/contexts/CampaignContext";
import { AdGenerationStep } from "@/components/campaign/AdGenerationStep";
import { useAdGenerationFlow } from "@/hooks/useAdGenerationFlow";
import { useAdUpdateHandlers } from "@/hooks/campaign/useAdUpdateHandlers";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";
import { useAdGeneration as useGoogleAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useMetaAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useMicrosoftAdGeneration } from "@/hooks/adGeneration";
import { useAdGeneration as useLinkedInAdGeneration } from "@/hooks/adGeneration";
import { MetaAd } from "@/hooks/adGeneration/types";
import { useImageGenerationHandler as useImageGenHandler } from "@/hooks/campaign/useImageGenerationHandler";

const CreateCampaignPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    analyzeWebsite, 
    analysisResult, 
    setAnalysisResult, 
    isAnalyzing,
    cacheInfo 
  } = useWebsiteAnalysis();
  
  const { 
    campaignData, 
    setCampaignData, 
    googleAds, 
    setGoogleAds, 
    metaAds, 
    setMetaAds,
    microsoftAds,
    setMicrosoftAds,
    linkedInAds,
    setLinkedInAds
  } = useCampaignState();
  
  const { 
    generateGoogleAds, 
    isGenerating: isGeneratingGoogleAds 
  } = useGoogleAdGeneration({});
  
  const { 
    generateMetaAds, 
    isGenerating: isGeneratingMetaAds 
  } = useMetaAdGeneration();
  
  const { 
    generateMicrosoftAds, 
    isGenerating: isGeneratingMicrosoftAds 
  } = useMicrosoftAdGeneration();
  
  const { 
    generateLinkedInAds, 
    isGenerating: isGeneratingLinkedInAds 
  } = useLinkedInAdGeneration();
  
  const {
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd
  } = useAdUpdateHandlers({
    setGoogleAds,
    setMetaAds,
    setMicrosoftAds,
    setLinkedInAds
  });
  
  const { 
    handleGenerateImage, 
    loadingImageIndex 
  } = useImageGenHandler();
  
  const { createCampaign } = useCampaignCreation();
  
  const isGenerating = isGeneratingGoogleAds || isGeneratingMetaAds || isGeneratingMicrosoftAds || isGeneratingLinkedInAds;
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleNextWrapper = (data?: any) => {
    if (data) {
      setCampaignData(prev => ({ ...prev, ...data }));
    }
    handleNext();
  };

  const handleWebsiteAnalysis = async (url: string) => {
    setCampaignData(prev => ({ ...prev, targetUrl: url }));
    
    try {
      console.log("Starting website analysis for URL:", url);
      const result = await analyzeWebsite(url);
      
      if (result) {
        console.log("Analysis successful:", result);
        setCampaignData(prev => ({ 
          ...prev, 
          name: result.companyName ? `${result.companyName} Campaign` : 'New Campaign',
          companyName: result.companyName || prev.companyName || 'New Company',
          description: result.companyDescription || '',
          keywords: result.keywords || [],
          targetAudience: result.targetAudience || '',
          industry: result.industry || ''
        }));
        
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error analyzing website:", error);
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: "Failed to analyze the website. Please try again."
      });
      return null;
    }
  };

  const handleAdsGenerated = (generatedAds: any) => {
    if (!generatedAds) return;

    if (generatedAds.google_ads) {
      setGoogleAds(generatedAds.google_ads);
    }
    if (generatedAds.meta_ads) {
      setMetaAds(generatedAds.meta_ads);
    }
    if (generatedAds.linkedin_ads) {
      setLinkedInAds(generatedAds.linkedin_ads);
    }
    if (generatedAds.microsoft_ads) {
      setMicrosoftAds(generatedAds.microsoft_ads);
    }

    handleNext();
  };

  const handleGenerateGoogleAds = async (): Promise<void> => {
    try {
      const adGenerationData = {
        companyName: campaignData.companyName || campaignData.name || 'Company',
        websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || '',
        objective: campaignData.objective || 'awareness',
        targetAudience: campaignData.targetAudience || '',
        product: campaignData.product || '',
        brandTone: campaignData.brandTone || 'professional',
        language: campaignData.language || 'english',
        industry: campaignData.industry || '',
        companyDescription: campaignData.description || '',
        differentials: [],
        keywords: campaignData.keywords || []
      };
      
      console.log("Generating Google ads with data:", adGenerationData);
      const ads = await generateGoogleAds(adGenerationData);
      if (ads) {
        setGoogleAds(ads);
      }
    } catch (error) {
      console.error("Error generating Google ads:", error);
    }
  };

  const handleGenerateMetaAds = async (): Promise<void> => {
    try {
      const adGenerationData = {
        companyName: campaignData.companyName || campaignData.name || 'Company',
        websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || '',
        objective: campaignData.objective || 'awareness',
        targetAudience: campaignData.targetAudience || '',
        product: campaignData.product || '',
        brandTone: campaignData.brandTone || 'professional',
        language: campaignData.language || 'english',
        industry: campaignData.industry || '',
        companyDescription: campaignData.description || '',
        differentials: [],
        keywords: campaignData.keywords || []
      };
      
      console.log("Generating Meta ads with data:", adGenerationData);
      const ads = await generateMetaAds(adGenerationData);
      if (ads) {
        setMetaAds(ads);
      }
    } catch (error) {
      console.error("Error generating Meta ads:", error);
    }
  };

  const handleGenerateMicrosoftAds = async (): Promise<void> => {
    try {
      const adGenerationData = {
        companyName: campaignData.companyName || campaignData.name || 'Company',
        websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || '',
        objective: campaignData.objective || 'awareness',
        targetAudience: campaignData.targetAudience || '',
        product: campaignData.product || '',
        brandTone: campaignData.brandTone || 'professional',
        language: campaignData.language || 'english',
        industry: campaignData.industry || '',
        companyDescription: campaignData.description || '',
        differentials: [],
        keywords: campaignData.keywords || []
      };
      
      console.log("Generating Microsoft ads with data:", adGenerationData);
      const ads = await generateMicrosoftAds(adGenerationData);
      if (ads) {
        setMicrosoftAds(ads);
      }
    } catch (error) {
      console.error("Error generating Microsoft ads:", error);
    }
  };

  const handleGenerateLinkedInAds = async (): Promise<void> => {
    try {
      const adGenerationData = {
        companyName: campaignData.companyName || campaignData.name || 'Company',
        websiteUrl: campaignData.websiteUrl || campaignData.targetUrl || '',
        objective: campaignData.objective || 'awareness',
        targetAudience: campaignData.targetAudience || '',
        product: campaignData.product || '',
        brandTone: campaignData.brandTone || 'professional',
        language: campaignData.language || 'english',
        industry: campaignData.industry || '',
        companyDescription: campaignData.description || '',
        differentials: [],
        keywords: campaignData.keywords || []
      };
      
      console.log("Generating LinkedIn ads with data:", adGenerationData);
      const ads = await generateLinkedInAds(adGenerationData);
      if (ads) {
        setLinkedInAds(ads);
      }
    } catch (error) {
      console.error("Error generating LinkedIn ads:", error);
    }
  };

  const handleCreateCampaign = async (): Promise<void> => {
    setIsCreating(true);
    try {
      const result = await createCampaign({
        name: campaignData.name,
        description: campaignData.description,
        platforms: campaignData.platforms,
        budget: campaignData.budget,
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        targetAudience: campaignData.targetAudience,
        objective: campaignData.objective,
        googleAds,
        metaAds,
        microsoftAds,
        linkedInAds,
        targetUrl: campaignData.targetUrl,
        websiteUrl: campaignData.websiteUrl,
        mindTriggers: campaignData.mindTriggers
      });

      if (result) {
        toast({
          title: "Campaign Created",
          description: "Your campaign has been created successfully."
        });
        navigate('/campaigns');
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "Failed to create the campaign. Please try again."
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateImageWrapper = async (ad: MetaAd, index: number) => {
    try {
      await handleGenerateImage(ad, index);
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        variant: "destructive",
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
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
    handleGenerateImage: handleGenerateImageWrapper,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    handleUpdateLinkedInAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign: handleCreateCampaign,
    cacheInfo
  });

  const renderStepContent = () => {
    if (currentStep === 4) {
      return (
        <AdGenerationStep
          analysisResult={analysisResult}
          campaignData={campaignData}
          onAdsGenerated={handleAdsGenerated}
          platforms={campaignData.platforms || []}
        />
      );
    }
    return getStepContent();
  };

  console.log("CreateCampaignPage rendering with step:", currentStep, "and campaign data:", campaignData);

  return (
    <CampaignProvider>
      <AppLayout activePage="campaigns">
        <div className="container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
          </div>
          
          <Stepper currentStep={currentStep} />
          
          <Card>
            <CardContent className="p-0">
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </CampaignProvider>
  );
};

export default CreateCampaignPage;
