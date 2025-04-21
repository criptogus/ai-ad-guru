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

const CreateCampaignPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  
  // Analysis hooks
  const { 
    analyzeWebsite, 
    analysisResult, 
    setAnalysisResult, 
    isAnalyzing,
    cacheInfo 
  } = useWebsiteAnalysis();
  
  // Campaign data state hook
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
  
  // Ad generation hooks
  const { generateGoogleAds, isGenerating: isGeneratingGoogleAds } = useGoogleAdGeneration({});
  const { generateMetaAds, isGenerating: isGeneratingMetaAds } = useMetaAdGeneration();
  const { generateMicrosoftAds, isGenerating: isGeneratingMicrosoftAds } = useMicrosoftAdGeneration();
  const { generateLinkedInAds, isGenerating: isGeneratingLinkedInAds } = useLinkedInAdGeneration();
  
  // Image generation hooks
  const { generateAdImage } = useImageGeneration();
  const { handleGenerateImage, loadingImageIndex } = useImageGenerationHandler({
    generateAdImage,
    metaAds,
    linkedInAds,
    setMetaAds,
    setLinkedInAds,
    campaignData
  });
  
  // Campaign creation hook
  const { createCampaign } = useCampaignCreation();
  
  // Check if any ad generation is in progress
  const isGenerating = isGeneratingGoogleAds || isGeneratingMetaAds || isGeneratingMicrosoftAds || isGeneratingLinkedInAds;
  
  // Handle the back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle the next button
  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle the next button with data
  const handleNextWrapper = (data?: any) => {
    if (data) {
      setCampaignData(prev => ({ ...prev, ...data }));
    }
    handleNext();
  };
  
  // Handle website analysis
  const handleWebsiteAnalysis = async (url: string): Promise<WebsiteAnalysisResult | null> => {
    // Set the target URL in campaign data
    setCampaignData(prev => ({ ...prev, targetUrl: url }));
    
    try {
      const result = await analyzeWebsite(url);
      
      if (result) {
        // Update campaign data with analysis result
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
  
  // Handle Google Ads generation
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
  
  // Handle Meta Ads generation
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
  
  // Handle Microsoft Ads generation
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
  
  // Handle LinkedIn Ads generation
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
  
  // Handle updating Google Ad
  const handleUpdateGoogleAd = (index: number, updatedAd: any) => {
    const updatedAds = [...googleAds];
    updatedAds[index] = updatedAd;
    setGoogleAds(updatedAds);
  };
  
  // Handle updating Meta Ad
  const handleUpdateMetaAd = (index: number, updatedAd: any) => {
    const updatedAds = [...metaAds];
    updatedAds[index] = updatedAd;
    setMetaAds(updatedAds);
  };
  
  // Handle updating Microsoft Ad
  const handleUpdateMicrosoftAd = (index: number, updatedAd: any) => {
    const updatedAds = [...microsoftAds];
    updatedAds[index] = updatedAd;
    setMicrosoftAds(updatedAds);
  };
  
  // Handle updating LinkedIn Ad
  const handleUpdateLinkedInAd = (index: number, updatedAd: any) => {
    const updatedAds = [...linkedInAds];
    updatedAds[index] = updatedAd;
    setLinkedInAds(updatedAds);
  };
  
  // Handle creating campaign
  const handleCreateCampaign = async () => {
    setIsCreating(true);
    
    try {
      // Make sure all required fields are present
      const campaignParams = {
        ...campaignData,
        googleAds,
        metaAds,
        microsoftAds,
        linkedInAds,
        name: campaignData.name || 'New Campaign',  // Ensure name is not optional
        description: campaignData.description || '',
        budget: campaignData.budget || 100,
        budgetType: campaignData.budgetType || 'daily',
        startDate: campaignData.startDate || new Date().toISOString().split('T')[0],
        platforms: campaignData.platforms || ['google'],
        objective: campaignData.objective || 'awareness'
      };
      
      const result = await createCampaign(campaignParams);
      
      if (result) {
        toast({
          title: "Campaign Created",
          description: "Your campaign has been created successfully."
        });
        
        // Redirect to campaigns page
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
  
  // Get the step content
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
  
  // Log the current state for debugging
  console.log("CreateCampaignPage rendering with step:", currentStep, "and campaign data:", campaignData);

  return (
    <AppLayout activePage="campaigns">
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
        </div>
        
        {/* Stepper */}
        <Stepper currentStep={currentStep} />
        
        {/* Step Content */}
        <Card>
          <CardContent className="p-0">
            {getStepContent()}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CreateCampaignPage;
