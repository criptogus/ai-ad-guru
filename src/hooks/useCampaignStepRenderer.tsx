
import React from "react";
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import PlatformSelectionStep from "@/components/campaign/PlatformSelectionStep";
import MindTriggerSelectionStep from "@/components/campaign/MindTriggerSelectionStep";
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
  linkedInAds: MetaAd[];
  isAnalyzing: boolean;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  isCreating: boolean;
  handleWebsiteAnalysis: (url: string) => Promise<WebsiteAnalysisResult | null>;
  // Updated return types to Promise<void> for all ad generation handlers
  handleGenerateGoogleAds: () => Promise<void>;
  handleGenerateMetaAds: () => Promise<void>;
  handleGenerateMicrosoftAds: () => Promise<void>;
  handleGenerateLinkedInAds: () => Promise<void>;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  handleUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  handleUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
  handleUpdateLinkedInAd: (index: number, updatedAd: MetaAd) => void;
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
          <MindTriggerSelectionStep
            selectedPlatforms={campaignData.platforms || []}
            selectedTriggers={campaignData.mindTriggers || {}}
            onTriggersChange={(mindTriggers) => setCampaignData({
              ...campaignData,
              mindTriggers
            })}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult!}
            campaignData={campaignData}
            onUpdateCampaignData={setCampaignData}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <AdPreviewStep
            analysisResult={analysisResult!}
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            linkedInAds={linkedInAds}
            isGenerating={isGenerating}
            loadingImageIndex={loadingImageIndex}
            onGenerateGoogleAds={handleGenerateGoogleAds}
            onGenerateMetaAds={handleGenerateMetaAds}
            onGenerateMicrosoftAds={handleGenerateMicrosoftAds}
            onGenerateLinkedInAds={handleGenerateLinkedInAds}
            onGenerateImage={handleGenerateImage}
            onUpdateGoogleAd={handleUpdateGoogleAd}
            onUpdateMetaAd={handleUpdateMetaAd}
            onUpdateMicrosoftAd={handleUpdateMicrosoftAd}
            onUpdateLinkedInAd={handleUpdateLinkedInAd}
            onNext={handleNextWrapper}
            onBack={handleBack}
            mindTriggers={campaignData.mindTriggers || {}}
          />
        );
      case 6:
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
            linkedInAds={linkedInAds}
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
