
import React from "react";
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import PlatformSelectionStep from "@/components/campaign/PlatformSelectionStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";
import CampaignSummary from "@/components/campaign/CampaignSummary";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface CampaignStepRendererProps {
  currentStep: number;
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: any[];
  isAnalyzing: boolean;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  isCreating: boolean;
  handleWebsiteAnalysis: (url: string) => Promise<WebsiteAnalysisResult | null>;
  handleGenerateGoogleAds: () => Promise<GoogleAd[] | null>;
  handleGenerateMetaAds: () => Promise<MetaAd[] | null>;
  handleGenerateMicrosoftAds: () => Promise<any[] | null>;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  handleUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  handleUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  handleBack: () => void;
  handleNextWrapper: (data?: any) => void;
  createCampaign: () => Promise<void>;
}

export const useCampaignStepRenderer = (props: CampaignStepRendererProps) => {
  const {
    currentStep,
    analysisResult,
    campaignData,
    googleAds,
    metaAds,
    microsoftAds,
    isAnalyzing,
    isGenerating,
    loadingImageIndex,
    isCreating,
    handleWebsiteAnalysis,
    handleGenerateGoogleAds,
    handleGenerateMetaAds,
    handleGenerateMicrosoftAds,
    handleGenerateImage,
    handleUpdateGoogleAd,
    handleUpdateMetaAd,
    handleUpdateMicrosoftAd,
    setCampaignData,
    handleBack,
    handleNextWrapper,
    createCampaign
  } = props;
  
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            analysisResult={analysisResult}
            isAnalyzing={isAnalyzing}
            onAnalyzeWebsite={handleWebsiteAnalysis}
            onNext={() => handleNextWrapper({ 
              websiteUrl: analysisResult?.websiteUrl || "",
              targetAudience: analysisResult?.targetAudience || "",
              description: analysisResult?.businessDescription || ""
            })}
          />
        );
      case 2:
        return (
          <PlatformSelectionStep
            selectedPlatforms={campaignData.platforms || []}
            onPlatformsChange={(platforms) => setCampaignData({
              ...campaignData,
              platforms
            })}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult!}
            campaignData={campaignData}
            onUpdateCampaignData={setCampaignData}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <AdPreviewStep
            analysisResult={analysisResult!}
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            isGenerating={isGenerating}
            loadingImageIndex={loadingImageIndex}
            onGenerateGoogleAds={handleGenerateGoogleAds}
            onGenerateMetaAds={handleGenerateMetaAds}
            onGenerateMicrosoftAds={handleGenerateMicrosoftAds}
            onGenerateImage={handleGenerateImage}
            onUpdateGoogleAd={handleUpdateGoogleAd}
            onUpdateMetaAd={handleUpdateMetaAd}
            onUpdateMicrosoftAd={handleUpdateMicrosoftAd}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <CampaignSummary
            campaignName={campaignData.name}
            platform={campaignData.platform}
            platforms={campaignData.platforms}
            budget={campaignData.budget}
            budgetType={campaignData.budgetType || "daily"}
            startDate={campaignData.startDate}
            endDate={campaignData.endDate}
            objective={campaignData.objective}
            targetAudience={campaignData.targetAudience}
            websiteUrl={analysisResult?.websiteUrl || ""}
            analysisResult={analysisResult!}
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            onApprove={createCampaign}
            onEdit={handleBack}
            isLoading={isCreating}
          />
        );
      default:
        return null;
    }
  };

  return { getStepContent };
};

export default useCampaignStepRenderer;
