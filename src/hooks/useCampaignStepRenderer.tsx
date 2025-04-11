
import React from "react";
import { WebsiteAnalysisResult, AnalysisCache } from "@/hooks/useWebsiteAnalysis";
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import PlatformSelectionStep from "@/components/campaign/PlatformSelectionStep";
import { MindTriggerSelectionStep } from "@/components/campaign/mind-trigger";
import AudienceAnalysisStep from "@/components/campaign/audience-analysis/AudienceAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/ad-preview/AdPreviewStep";
import CampaignSummary from "@/components/campaign/CampaignSummary";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration/types";

interface UseCampaignStepRendererProps {
  currentStep: number;
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: GoogleAd[];
  linkedInAds: MetaAd[];
  isAnalyzing: boolean;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  isCreating: boolean;
  handleWebsiteAnalysis: (url: string) => Promise<WebsiteAnalysisResult | null>;
  handleGenerateGoogleAds: () => Promise<void>;
  handleGenerateMetaAds: () => Promise<void>;
  handleGenerateMicrosoftAds: () => Promise<void>;
  handleGenerateLinkedInAds: () => Promise<void>;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  handleUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  handleUpdateMicrosoftAd: (index: number, updatedAd: GoogleAd) => void;
  handleUpdateLinkedInAd: (index: number, updatedAd: MetaAd) => void;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  handleBack: () => void;
  handleNextWrapper: (data?: any) => void;
  createCampaign: () => Promise<void>;
  cacheInfo?: AnalysisCache | null;
}

const useCampaignStepRenderer = ({
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
}: UseCampaignStepRendererProps) => {
  const getStepContent = () => {
    // Add logging to debug the current step
    console.log("Rendering step:", currentStep, "Campaign data:", campaignData);
    
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={handleWebsiteAnalysis}
            onNext={() => handleNextWrapper()}
            cacheInfo={cacheInfo}
          />
        );
      case 2:
        return (
          <PlatformSelectionStep 
            onNext={(data) => handleNextWrapper(data)}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <MindTriggerSelectionStep
            selectedPlatforms={campaignData.platforms || []}
            selectedTriggers={campaignData.mindTriggers || {}}
            onTriggersChange={(mindTriggers) => {
              setCampaignData(prev => ({
                ...prev,
                mindTriggers
              }));
            }}
            onBack={handleBack}
            onNext={() => handleNextWrapper()}
          />
        );
      case 4:
        return (
          <AudienceAnalysisStep
            analysisResult={analysisResult}
            onBack={handleBack}
            onNext={() => handleNextWrapper()}
          />
        );
      case 5:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult}
            campaignData={campaignData}
            onUpdateCampaignData={(setupData) => setCampaignData(prev => ({ ...prev, ...setupData }))}
            onBack={handleBack}
            onNext={() => handleNextWrapper()}
          />
        );
      case 6:
        return (
          <AdPreviewStep
            analysisResult={analysisResult}
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
            onNext={() => handleNextWrapper()}
            onBack={handleBack}
            mindTriggers={campaignData.mindTriggers}
          />
        );
      case 7:
        return (
          <CampaignSummary
            campaignName={campaignData.name || ""}
            platforms={campaignData.platforms || []}
            budget={campaignData.budget || 0}
            budgetType={campaignData.budgetType || "daily"}
            startDate={campaignData.startDate || ""}
            endDate={campaignData.endDate}
            objective={campaignData.objective || ""}
            targetAudience={campaignData.targetAudience || ""}
            websiteUrl={campaignData.targetUrl || analysisResult?.websiteUrl || ""}
            analysisResult={analysisResult}
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
