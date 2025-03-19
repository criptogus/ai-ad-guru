
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAdCard } from "./card";

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
  return (
    <div className="space-y-6">
      {metaAds.map((ad, index) => (
        <MetaAdCard 
          key={index} 
          ad={ad} 
          index={index} 
          analysisResult={analysisResult}
          loadingImageIndex={loadingImageIndex}
          onGenerateImage={onGenerateImage}
          onUpdate={onUpdateAd}
        />
      ))}
    </div>
  );
};

export default AdsList;
