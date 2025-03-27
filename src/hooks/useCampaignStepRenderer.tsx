
import React from "react";
import { WebsiteAnalysisResult, AnalysisCache } from "@/hooks/useWebsiteAnalysis";
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import PlatformSelectionStep from "@/components/campaign/PlatformSelectionStep";
import { MindTriggerSelectionStep } from "@/components/campaign/mind-trigger";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";
import CampaignSummary from "@/components/campaign/CampaignSummary";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";

interface UseCampaignStepRendererProps {
  currentStep: number;
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  microsoftAds: any[];
  linkedInAds: any[];
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
  handleUpdateMicrosoftAd: (index: number, updatedAd: any) => void;
  handleUpdateLinkedInAd: (index: number, updatedAd: any) => void;
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
    switch (currentStep) {
      case 0:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={handleWebsiteAnalysis}
            onNext={() => handleNextWrapper()}
            cacheInfo={cacheInfo}
          />
        );
      case 1:
        return (
          <PlatformSelectionStep 
            onNext={(platforms) => handleNextWrapper({ platforms })}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <MindTriggerSelectionStep
            selectedPlatforms={campaignData.platforms || []}
            onNext={(mindTriggers) => handleNextWrapper({ mindTriggers })}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult}
            onNext={(setupData) => handleNextWrapper(setupData)}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <AdPreviewStep
            analysisResult={analysisResult}
            campaignData={campaignData}
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
          />
        );
      case 5:
        return (
          <CampaignSummary
            analysisResult={analysisResult}
            campaignData={campaignData}
            googleAds={googleAds}
            metaAds={metaAds}
            microsoftAds={microsoftAds}
            linkedInAds={linkedInAds}
            isCreating={isCreating}
            onBack={handleBack}
            onCreateCampaign={createCampaign}
          />
        );
      default:
        return null;
    }
  };

  return { getStepContent };
};

export default useCampaignStepRenderer;
