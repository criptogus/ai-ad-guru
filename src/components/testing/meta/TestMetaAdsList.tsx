
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import MetaAdCard from "@/components/campaign/ad-preview/meta/card/MetaAdCard";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";

interface TestMetaAdsListProps {
  metaAds: MetaAd[];
  defaultAnalysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  handleGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  handleUpdateAd: (index: number, updatedAd: MetaAd) => void;
}

const TestMetaAdsList: React.FC<TestMetaAdsListProps> = ({
  metaAds,
  defaultAnalysisResult,
  loadingImageIndex,
  handleGenerateImage,
  handleUpdateAd
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Test Ads ({metaAds.length})</h2>
      
      {metaAds.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p>No test ads created yet. Add one above.</p>
        </div>
      ) : (
        metaAds.map((ad, index) => (
          <MetaAdCard 
            key={index} 
            ad={ad} 
            index={index} 
            analysisResult={defaultAnalysisResult}
            loadingImageIndex={loadingImageIndex}
            onGenerateImage={(ad) => handleGenerateImage(ad, index)}
            onUpdate={(updatedAd) => handleUpdateAd(index, updatedAd)}
          />
        ))
      )}
    </div>
  );
};

export default TestMetaAdsList;
