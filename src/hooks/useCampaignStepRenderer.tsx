
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";

interface UseCampaignStepRendererProps {
  currentStep: number;
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  isAnalyzing: boolean;
  isGenerating: boolean;
  handleWebsiteAnalysis: (url: string) => Promise<WebsiteAnalysisResult | null>;
  handleGenerateGoogleAds: () => Promise<void>;
  handleGenerateMetaAds: () => Promise<void>;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  handleUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  handleBack: () => void;
  handleNextWrapper: () => void;
}

export const useCampaignStepRenderer = ({
  currentStep,
  analysisResult,
  campaignData,
  googleAds,
  metaAds,
  isAnalyzing,
  isGenerating,
  handleWebsiteAnalysis,
  handleGenerateGoogleAds,
  handleGenerateMetaAds,
  handleGenerateImage,
  handleUpdateGoogleAd,
  handleUpdateMetaAd,
  setCampaignData,
  handleBack,
  handleNextWrapper
}: UseCampaignStepRendererProps) => {
  
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={handleWebsiteAnalysis}
            onNext={handleNextWrapper}
          />
        );
      case 2:
        return (
          <CampaignSetupStep
            analysisResult={analysisResult!}
            campaignData={campaignData}
            onUpdateCampaignData={setCampaignData}
            onBack={handleBack}
            onNext={handleNextWrapper}
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
            onUpdateGoogleAd={handleUpdateGoogleAd}
            onUpdateMetaAd={handleUpdateMetaAd}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };
  
  return { getStepContent };
};
