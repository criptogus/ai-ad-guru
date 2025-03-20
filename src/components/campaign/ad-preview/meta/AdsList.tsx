
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import AdsList from "./ads-list/AdsList";

interface AdsListProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

// This is now just a wrapper for the refactored component
const AdsListWrapper: React.FC<AdsListProps> = (props) => {
  return <AdsList {...props} />;
};

export default AdsListWrapper;
