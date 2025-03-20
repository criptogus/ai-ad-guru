
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
          buttonText="Generate Instagram Ads"
        />
      ) : (
        <>
          <TabHeader 
            title="Instagram Ads" 
            description="Preview and customize your Instagram ads below. Each image generation costs 5 credits."
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
