
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { TabHeader, AdsList } from "./meta";
import EmptyAdState from "./EmptyAdState";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({ 
  metaAds, 
  analysisResult, 
  isGenerating, 
  loadingImageIndex,
  onGenerateMetaAds,
  onGenerateImage,
  onUpdateAd
}) => {
  console.log("MetaAdsTab - metaAds:", metaAds);
  console.log("MetaAdsTab - loadingImageIndex:", loadingImageIndex);
  
  const hasAds = metaAds && metaAds.length > 0;
  
  return (
    <div className="pt-4 space-y-4">
      {!hasAds ? (
        <EmptyAdState 
          platform="meta"
          onGenerate={onGenerateMetaAds}
          isGenerating={isGenerating}
        />
      ) : (
        <>
          <TabHeader 
            title="Meta/Instagram Ads" 
            description="Preview and customize your Meta and Instagram ads below."
          />
          <AdsList 
            metaAds={metaAds}
            analysisResult={analysisResult}
            loadingImageIndex={loadingImageIndex}
            onGenerateImage={onGenerateImage}
            onUpdateAd={onUpdateAd}
          />
        </>
      )}
    </div>
  );
};

export default MetaAdsTab;
