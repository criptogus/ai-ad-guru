
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import EmptyAdsState from "./EmptyAdsState";
import { AdsList } from "@/components/campaign/ad-preview/meta";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<MetaAd[] | null>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateMetaAd: (updatedAds: MetaAd[]) => void;
  analysisResult: WebsiteAnalysisResult;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({
  metaAds,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateMetaAd,
  analysisResult,
}) => {
  const handleGenerateAds = async () => {
    await onGenerateAds();
  };

  if (!analysisResult) {
    return (
      <Card>
        <CardContent>
          Please analyze a website to generate ads.
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center space-x-2">
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Generating Instagram Ads...
        </CardContent>
      </Card>
    );
  }

  if (!metaAds || metaAds.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyAdsState platform="Instagram" />
          <Button onClick={handleGenerateAds} className="mt-4" disabled={isGenerating}>
            Generate Instagram Ads
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <AdsList 
        metaAds={metaAds}
        analysisResult={analysisResult}
        loadingImageIndex={loadingImageIndex}
        onGenerateImage={onGenerateImage}
        onUpdateAd={(index, updatedAd) => {
          const updatedAds = [...metaAds];
          updatedAds[index] = updatedAd;
          onUpdateMetaAd(updatedAds);
        }}
      />
      <Button onClick={handleGenerateAds} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate More Instagram Ads"
        )}
      </Button>
    </div>
  );
};

export default MetaAdsTab;
