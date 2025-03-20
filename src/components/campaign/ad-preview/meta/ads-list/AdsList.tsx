
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import AdCard from "./AdCard";
import NoAdsMessage from "./NoAdsMessage";

interface AdsListProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const AdsList: React.FC<AdsListProps> = ({
  metaAds,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd
}) => {
  if (!metaAds || metaAds.length === 0) {
    return <NoAdsMessage />;
  }

  return (
    <div className="space-y-6">
      {metaAds.map((ad, index) => (
        <AdCard
          key={index}
          ad={ad}
          index={index}
          analysisResult={analysisResult}
          loadingImageIndex={loadingImageIndex}
          onGenerateImage={onGenerateImage}
          onUpdateAd={onUpdateAd}
        />
      ))}
    </div>
  );
};

export default AdsList;
