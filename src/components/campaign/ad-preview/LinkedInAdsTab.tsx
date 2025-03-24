
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCard from "./linkedin/LinkedInAdCard";
import EmptyAdState from "./EmptyAdState";

// Define types locally instead of importing from GoogleAdsTab
type PreviewLayout = "split-horizontal" | "split-vertical" | "full";
type DevicePreview = "desktop" | "mobile" | "tablet";
type AdFormat = "square" | "landscape" | "portrait";

interface LinkedInAdsTabProps {
  linkedInAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateLinkedInAds: () => Promise<MetaAd[] | null>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
  previewLayout?: PreviewLayout;
  devicePreview?: DevicePreview;
  adFormat?: AdFormat;
}

const LinkedInAdsTab: React.FC<LinkedInAdsTabProps> = ({ 
  linkedInAds, 
  analysisResult, 
  isGenerating, 
  loadingImageIndex,
  onGenerateLinkedInAds,
  onGenerateImage,
  onUpdateAd,
  previewLayout = "split-horizontal",
  devicePreview = "desktop",
  adFormat = "square"
}) => {
  const hasAds = linkedInAds && linkedInAds.length > 0;
  
  // Wrap the generate ads function to match the expected return type
  const handleGenerateAds = async () => {
    return await onGenerateLinkedInAds();
  };
  
  return (
    <div className="pt-4 space-y-4">
      {!hasAds ? (
        <EmptyAdState 
          platform="LinkedIn"
          onGenerate={handleGenerateAds}
          isGenerating={isGenerating}
          buttonText="Generate LinkedIn Ads"
        />
      ) : (
        <div className="space-y-6">
          {linkedInAds.map((ad, index) => (
            <LinkedInAdCard 
              key={index} 
              ad={ad} 
              index={index} 
              isGeneratingImage={loadingImageIndex === index}
              analysisResult={analysisResult}
              onGenerateImage={() => onGenerateImage(ad, index)}
              onUpdateAd={onUpdateAd}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkedInAdsTab;
