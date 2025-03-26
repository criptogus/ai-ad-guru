
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCard from "./LinkedInAdCard";

interface LinkedInAdsListProps {
  linkedInAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const LinkedInAdsList: React.FC<LinkedInAdsListProps> = ({
  linkedInAds,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd
}) => {
  if (!linkedInAds || linkedInAds.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No LinkedIn ads to display. Click "Generate LinkedIn Ads" to create ads.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {linkedInAds.map((ad, index) => (
        <LinkedInAdCard
          key={index}
          ad={ad}
          index={index}
          analysisResult={analysisResult}
          isGeneratingImage={loadingImageIndex === index}
          onGenerateImage={() => onGenerateImage(ad, index)}
          onUpdateAd={onUpdateAd ? (updatedAd) => onUpdateAd(index, updatedAd) : undefined}
        />
      ))}
    </div>
  );
};

export default LinkedInAdsList;
