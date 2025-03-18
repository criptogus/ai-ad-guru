
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MetaAdCard from "./MetaAdCard";
import EmptyAdState from "./EmptyAdState";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({ 
  metaAds, 
  analysisResult, 
  isGenerating, 
  loadingImageIndex,
  onGenerateMetaAds,
  onGenerateImage
}) => {
  return (
    <div className="pt-4 space-y-4">
      {metaAds.length === 0 ? (
        <EmptyAdState 
          platform="meta"
          onGenerate={onGenerateMetaAds}
          isGenerating={isGenerating}
        />
      ) : (
        <div className="space-y-6">
          {metaAds.map((ad, index) => (
            <MetaAdCard 
              key={index} 
              ad={ad} 
              index={index} 
              analysisResult={analysisResult}
              loadingImageIndex={loadingImageIndex}
              onGenerateImage={onGenerateImage}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetaAdsTab;
