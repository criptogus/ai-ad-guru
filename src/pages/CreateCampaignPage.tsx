
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Check } from "lucide-react";
import { useWebsiteAnalysis, WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { useAdGeneration, GoogleAd, MetaAd } from "@/hooks/useAdGeneration";
import { supabase } from "@/integrations/supabase/client";

// Import our steps
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";

// Step indicator component
const StepIndicator = ({ 
  number, 
  title, 
  active, 
  completed 
}: { 
  number: number; 
  title: string; 
  active: boolean; 
  completed: boolean; 
}) => {
  return (
    <div className="flex items-center">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 
        ${active ? "bg-brand-600 text-white" : ""} 
        ${completed ? "bg-green-600 text-white" : ""} 
        ${!active && !completed ? "border-2 border-muted-foreground/30 text-muted-foreground" : ""}`}
      >
        {completed ? <Check size={20} /> : number}
      </div>
      <span className={`${active ? "font-medium" : ""} ${completed ? "font-medium" : ""}`}>
        {title}
      </span>
    </div>
  );
};

const CreateCampaignPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Website analysis state
  const { analyzeWebsite, isAnalyzing, analysisResult } = useWebsiteAnalysis();
  
  // Ad generation state
  const { generateGoogleAds, generateMetaAds, generateAdImage, isGenerating, googleAds, metaAds } = useAdGeneration();
  
  // Campaign data state
  const [campaignData, setCampaignData] = useState({
    name: "",
    platform: "google", // Default: google or meta
    budget: 50,
    budgetType: "daily",
    startDate: "",
    endDate: "",
    objective: "traffic",
    targetAudience: "",
    description: "",
    websiteUrl: "",
    businessInfo: null,
    googleAds: [],
    metaAds: [],
  });

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1 && !analysisResult) {
      toast({
        title: "Website Analysis Required",
        description: "Please analyze a website before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2) {
      if (!campaignData.name || !campaignData.description) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 3) {
      if (user && user.credits < 5) {
        toast({
          title: "Insufficient credits",
          description: "You need at least 5 credits to create a campaign",
          variant: "destructive",
        });
        return;
      }
      
      createCampaign();
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleAnalyzeWebsite = async (url: string) => {
    const result = await analyzeWebsite(url);
    if (result) {
      setCampaignData(prev => ({
        ...prev,
        websiteUrl: url,
        businessInfo: result,
      }));
    }
    return result;
  };

  const handleGenerateGoogleAds = async () => {
    if (!analysisResult) return;
    
    const ads = await generateGoogleAds(analysisResult);
    if (ads) {
      setCampaignData(prev => ({
        ...prev,
        googleAds: ads,
      }));
    }
  };

  const handleGenerateMetaAds = async () => {
    if (!analysisResult) return;
    
    const ads = await generateMetaAds(analysisResult);
    if (ads) {
      setCampaignData(prev => ({
        ...prev,
        metaAds: ads,
      }));
    }
  };

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    if (!metaAds || metaAds.length === 0) return;
    
    const imageUrl = await generateAdImage(ad.imagePrompt);
    if (imageUrl) {
      // Update the Meta ad with the generated image URL
      const updatedAds = [...metaAds];
      updatedAds[index] = {
        ...updatedAds[index],
        imageUrl,
      };
      
      // Update state
      setCampaignData(prev => ({
        ...prev,
        metaAds: updatedAds,
      }));
    }
  };

  const createCampaign = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create a campaign",
          variant: "destructive",
        });
        return;
      }
      
      // Insert campaign into database
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          user_id: user.id,
          name: campaignData.name,
          platform: campaignData.platform,
          budget: campaignData.budget,
          budget_type: campaignData.budgetType,
          status: 'draft',
        })
        .select()
        .single();
      
      if (campaignError) {
        console.error('Error creating campaign:', campaignError);
        toast({
          title: "Campaign Creation Failed",
          description: campaignError.message || "Failed to create campaign",
          variant: "destructive",
        });
        return;
      }
      
      // Deduct credits from user
      const { error: creditsError } = await supabase
        .from('profiles')
        .update({ credits: (user.credits || 0) - 5 })
        .eq('id', user.id);
      
      if (creditsError) {
        console.error('Error updating credits:', creditsError);
      }
      
      toast({
        title: "Campaign Created Successfully",
        description: "Your campaign has been created and 5 credits have been deducted from your account",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Campaign Creation Failed",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={handleAnalyzeWebsite}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult!}
            campaignData={campaignData}
            onUpdateCampaignData={setCampaignData}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <AdPreviewStep
            analysisResult={analysisResult!}
            googleAds={googleAds}
            metaAds={metaAds}
            isGenerating={isGenerating}
            onGenerateGoogleAds={handleGenerateGoogleAds}
            onGenerateMetaAds={handleGenerateMetaAds}
            onGenerateImage={handleGenerateImage}
            onNext={handleNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout activePage="campaigns">
      <div className="p-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" className="mr-2" onClick={handleBack}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Campaign</h1>
            <p className="text-muted-foreground">Let AI help you create a high-converting ad campaign</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-12">
              <StepIndicator 
                number={1} 
                title="Website Analysis" 
                active={currentStep === 1} 
                completed={currentStep > 1} 
              />
              <StepIndicator 
                number={2} 
                title="Campaign Setup" 
                active={currentStep === 2} 
                completed={currentStep > 2} 
              />
              <StepIndicator 
                number={3} 
                title="Ad Generation" 
                active={currentStep === 3} 
                completed={currentStep > 3} 
              />
            </div>
          </div>

          {getStepContent()}
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateCampaignPage;
