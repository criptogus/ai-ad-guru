
import React from 'react';
import { WebsiteAnalysisResult, AnalysisCache } from '@/hooks/useWebsiteAnalysis';
import { GoogleAd, MetaAd } from '@/hooks/adGeneration/types';
import WebsiteAnalysisStep from '@/components/campaign/WebsiteAnalysisStep';
import PlatformSelectionStep from '@/components/campaign/PlatformSelectionStep';
import { MindTriggerSelectionStep } from '@/components/campaign/mind-trigger/MindTriggerSelectionStep';
import CampaignSetupStep from '@/components/campaign/CampaignSetupStep';
import AdPreviewStep from '@/components/campaign/ad-preview/AdPreviewStep';
import { AdGenerationStep } from '@/components/campaign/AdGenerationStep';
// Import other steps as needed

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
  handleAdsGenerated: (ads: any) => void;
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
  handleAdsGenerated
}: UseCampaignStepRendererProps) => {
  console.log("Rendering step:", currentStep, "Campaign data:", campaignData);
  
  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <WebsiteAnalysisStep
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            onAnalyzeWebsite={handleWebsiteAnalysis}
            onNext={handleNextWrapper}
            cacheInfo={cacheInfo}
          />
        );
      case 2:
        return (
          <PlatformSelectionStep 
            onNext={handleNextWrapper}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <MindTriggerSelectionStep
            selectedPlatforms={campaignData.platforms || []}
            selectedTriggers={campaignData.mindTriggers || {}}
            onTriggersChange={(triggers) => {
              setCampaignData(prev => ({...prev, mindTriggers: triggers}));
            }}
            onBack={handleBack}
            onNext={handleNextWrapper}
          />
        );
      case 4:
        return (
          <CampaignSetupStep
            campaignData={campaignData}
            analysisResult={analysisResult}
            onNext={handleNextWrapper}
            onBack={handleBack}
            onUpdateCampaignData={(data) => {
              setCampaignData(prev => ({...prev, ...data}));
            }}
          />
        );
      case 5:
        return (
          <AdGenerationStep
            analysisResult={analysisResult}
            campaignData={campaignData}
            onAdsGenerated={handleAdsGenerated}
            platforms={campaignData.platforms || []}
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
            onNext={handleNextWrapper}
            onBack={handleBack}
            mindTriggers={campaignData.mindTriggers}
          />
        );
      case 7:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Campaign Summary</h2>
            {/* Summary content */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={createCampaign}
                disabled={isCreating}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 disabled:opacity-70"
              >
                {isCreating ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return { getStepContent };
};

export default useCampaignStepRenderer;
