
import React from "react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd, MetaAd } from "@/hooks/adGeneration";
import WebsiteAnalysisStep from "@/components/campaign/WebsiteAnalysisStep";
import CampaignSetupStep from "@/components/campaign/CampaignSetupStep";
import AdPreviewStep from "@/components/campaign/AdPreviewStep";
import CampaignSummary from "@/components/campaign/CampaignSummary";

export interface UseCampaignStepRendererProps {
  currentStep: number;
  analysisResult: WebsiteAnalysisResult | null;
  campaignData: any;
  googleAds: GoogleAd[];
  metaAds: MetaAd[];
  isAnalyzing: boolean;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  isCreating: boolean;
  handleWebsiteAnalysis: (url: string) => Promise<WebsiteAnalysisResult | null>;
  handleGenerateGoogleAds: () => Promise<void>;
  handleGenerateMetaAds: () => Promise<void>;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  handleUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  setCampaignData: React.Dispatch<React.SetStateAction<any>>;
  handleBack: () => void;
  handleNextWrapper: () => void;
  createCampaign: () => Promise<void>;
}

export const useCampaignStepRenderer = ({
  currentStep,
  analysisResult,
  campaignData,
  googleAds,
  metaAds,
  isAnalyzing,
  isGenerating,
  loadingImageIndex,
  isCreating,
  handleWebsiteAnalysis,
  handleGenerateGoogleAds,
  handleGenerateMetaAds,
  handleGenerateImage,
  handleUpdateGoogleAd,
  handleUpdateMetaAd,
  setCampaignData,
  handleBack,
  handleNextWrapper,
  createCampaign
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
            loadingImageIndex={loadingImageIndex}
            onGenerateGoogleAds={handleGenerateGoogleAds}
            onGenerateMetaAds={handleGenerateMetaAds}
            onGenerateImage={handleGenerateImage}
            onUpdateGoogleAd={handleUpdateGoogleAd}
            onUpdateMetaAd={handleUpdateMetaAd}
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <CampaignSummary 
            campaignName={campaignData.name}
            platform={campaignData.platform}
            budget={campaignData.budget}
            budgetType={campaignData.budgetType}
            startDate={campaignData.startDate}
            endDate={campaignData.endDate}
            objective={campaignData.objective}
            targetAudience={campaignData.targetAudience}
            websiteUrl={campaignData.websiteUrl}
            analysisResult={analysisResult!}
            googleAds={googleAds}
            metaAds={metaAds}
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
