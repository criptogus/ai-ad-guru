import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useWebsiteAnalysis, WebsiteAnalysisResult, AnalysisCache } from "@/hooks/useWebsiteAnalysis";
import { useCampaignCreation } from "@/hooks/useCampaignCreation";
import { useCampaignState } from "@/hooks/useCampaignState";
import { useGoogleAdGeneration } from "@/hooks/adGeneration/useGoogleAdGeneration";
import { useMetaAdGeneration } from "@/hooks/adGeneration/useMetaAdGeneration";
import { useMicrosoftAdGeneration } from "@/hooks/adGeneration/useMicrosoftAdGeneration";
import { useLinkedInAdGeneration } from "@/hooks/adGeneration/useLinkedInAdGeneration";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";
import { useImageGenerationHandler } from "@/hooks/useImageGenerationHandler";
import { Stepper } from "@/components/campaign/Stepper";
import useCampaignStepRenderer from "@/hooks/useCampaignStepRenderer";
import AppLayout from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { CampaignProvider } from "@/contexts/CampaignContext";

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
  
  const { generateAdImage } = useImageGeneration();
  const { handleGenerateImage, loadingImageIndex } = useImageGenerationHandler({
    generateAdImage,
    metaAds,
    linkedInAds,
    setMetaAds,
    setLinkedInAds,
    campaignData
  });
  
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
  
  const handleWebsiteAnalysis = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    setCampaignData(prev => ({ ...prev, targetUrl: url }));
    
    try {
      console.log("Starting website analysis for URL:", url);
      const result = await analyzeWebsite(url);
      
      if (result) {
        console.log("Analysis successful:", result);
        setCampaignData(prev => ({ 
          ...prev, 
          name: result.companyName ? `${result.companyName} Campaign` : 'New Campaign',
          description: result.companyDescription || '',
          keywords: result.keywords || [],
          targetAudience: result.targetAudience || '',
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
  
  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) return;
    
    try {
      console.log("Generating Google Ads with data:", {
        companyName: analysisResult.companyName,
        companyDescription: analysisResult.companyDescription,
        targetAudience: analysisResult.targetAudience,
        keywords: analysisResult.keywords,
        mindTrigger: campaignData.mindTriggers?.google || ''
      });
      
      const newAds = await generateGoogleAds({
        companyName: analysisResult.companyName || '',
        companyDescription: analysisResult.companyDescription || '',
        targetAudience: analysisResult.targetAudience || '',
        keywords: analysisResult.keywords || [],
        mindTrigger: campaignData.mindTriggers?.google || '',
        industry: analysisResult.industry || ''
      });
      
      if (newAds && newAds.length > 0) {
        setGoogleAds(newAds);
      }
    } catch (error) {
      console.error("Error generating Google Ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate Google Ads. Please try again."
      });
    }
  };
  
  const handleGenerateMetaAds = async () => {
    if (!analysisResult) return;
    
    try {
      console.log("Generating Meta Ads with data:", {
        companyName: analysisResult.companyName,
        description: analysisResult.companyDescription,
        targetAudience: analysisResult.targetAudience,
        keywords: analysisResult.keywords,
        mindTrigger: campaignData.mindTriggers?.meta || ''
      });
      
      const newAds = await generateMetaAds({
        companyName: analysisResult.companyName || '',
        companyDescription: analysisResult.companyDescription || '',
        targetAudience: analysisResult.targetAudience || '',
        keywords: analysisResult.keywords || [],
        mindTrigger: campaignData.mindTriggers?.meta || '',
        industry: analysisResult.industry || ''
      });
      
      if (newAds && newAds.length > 0) {
        setMetaAds(newAds);
      }
    } catch (error) {
      console.error("Error generating Meta Ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate Meta Ads. Please try again."
      });
    }
  };
  
  const handleGenerateMicrosoftAds = async () => {
    if (!analysisResult) return;
    
    try {
      console.log("Generating Microsoft Ads with data:", {
        companyName: analysisResult.companyName,
        description: analysisResult.companyDescription,
        targetAudience: analysisResult.targetAudience,
        keywords: analysisResult.keywords,
        mindTrigger: campaignData.mindTriggers?.microsoft || ''
      });
      
      const newAds = await generateMicrosoftAds({
        companyName: analysisResult.companyName || '',
        companyDescription: analysisResult.companyDescription || '',
        targetAudience: analysisResult.targetAudience || '',
        keywords: analysisResult.keywords || [],
        mindTrigger: campaignData.mindTriggers?.microsoft || '',
        industry: analysisResult.industry || ''
      });
      
      if (newAds && newAds.length > 0) {
        setMicrosoftAds(newAds);
      }
    } catch (error) {
      console.error("Error generating Microsoft Ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate Microsoft Ads. Please try again."
      });
    }
  };
  
  const handleGenerateLinkedInAds = async () => {
    if (!analysisResult) return;
    
    try {
      console.log("Generating LinkedIn Ads with data:", {
        companyName: analysisResult.companyName,
        description: analysisResult.companyDescription,
        targetAudience: analysisResult.targetAudience,
        keywords: analysisResult.keywords,
        mindTrigger: campaignData.mindTriggers?.linkedin || ''
      });
      
      const newAds = await generateLinkedInAds({
        companyName: analysisResult.companyName || '',
        companyDescription: analysisResult.companyDescription || '',
        targetAudience: analysisResult.targetAudience || '',
        keywords: analysisResult.keywords || [],
        mindTrigger: campaignData.mindTriggers?.linkedin || '',
        industry: analysisResult.industry || ''
      });
      
      if (newAds && newAds.length > 0) {
        setLinkedInAds(newAds);
      }
    } catch (error) {
      console.error("Error generating LinkedIn Ads:", error);
      toast({
        variant: "destructive",
        title: "Generation Error",
        description: "Failed to generate LinkedIn Ads. Please try again."
      });
    }
  };
  
  const handleUpdateGoogleAd = (index: number, updatedAd: any) => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setGoogleAds(updatedAds);
  };
  
  const handleUpdateMetaAd = (index: number, updatedAd: any) => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setMetaAds(updatedAds);
  };
  
  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    const updatedAds = [...microsoftAds];
    updatedAds[index] = updatedAd;
    setMicrosoftAds(updatedAds);
  };
  
  const handleUpdateLinkedInAd = (index: number, updatedAd: any) => {
    const updatedAds = [...linkedInAds];
    updatedAds[index] = updatedAd;
    setLinkedInAds(updatedAds);
  };
  
  const handleCreateCampaign = async () => {
    setIsCreating(true);
    
    try {
      const campaignParams = {
        name: campaignData.name || 'New Campaign',
        description: campaignData.description || '',
        targetUrl: campaignData.targetUrl,
        platforms: campaignData.platforms || ['google'],
        budget: campaignData.budget || 100,
        budgetType: (campaignData.budgetType as 'daily' | 'lifetime') || 'daily',
        startDate: campaignData.startDate || new Date().toISOString().split('T')[0],
        endDate: campaignData.endDate,
        objective: campaignData.objective || 'awareness',
        mindTriggers: campaignData.mindTriggers,
        googleAds,
        metaAds,
        microsoftAds,
        linkedInAds
      };
      
      console.log("Creating campaign with params:", campaignParams);
      const result = await createCampaign(campaignParams);
      
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
        title: "Creation Error",
        description: "Failed to create campaign. Please try again."
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleGenerateImageWrapper = async (index: number) => {
    if (index < 0) return;
    
    if (metaAds && metaAds.length > index) {
      await handleGenerateImage(metaAds[index], index);
    } else if (linkedInAds && linkedInAds.length > index) {
      await handleGenerateImage(linkedInAds[index], index);
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
    createCampaign: handleCreateCampaign,
    cacheInfo
  });

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
              {getStepContent()}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </CampaignProvider>
  );
};

export default CreateCampaignPage;
