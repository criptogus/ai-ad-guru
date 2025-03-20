
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAdCard } from "../card";

interface AdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const AdCard: React.FC<AdCardProps> = ({
  ad,
  index,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd
}) => {
  return (
    <MetaAdCard 
      key={index} 
      ad={ad} 
      index={index} 
      analysisResult={analysisResult}
      loadingImageIndex={loadingImageIndex}
      onGenerateImage={() => onGenerateImage(ad, index)}
      onUpdate={onUpdateAd ? (updatedAd) => onUpdateAd(index, updatedAd) : undefined}
    />
  );
};

export default AdCard;
