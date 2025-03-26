
import React from "react";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAd } from "@/hooks/adGeneration";
import { Loader2 } from "lucide-react";
import AdsList from "./ads-list/AdsList";
import { AdTemplate } from "../template-gallery/TemplateGallery";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateMetaAd: (index: number, updatedAd: MetaAd) => void;
  mindTrigger?: string;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({
  metaAds,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateMetaAd,
  mindTrigger
}) => {
  const handleUpdateAd = (index: number, updatedAd: MetaAd) => {
    onUpdateMetaAd(index, updatedAd);
  };

  const handleGenerateImage = (ad: MetaAd, index: number) => {
    onGenerateImage(ad, index);
  };

  return (
    <div>
      {metaAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Generate Instagram ads based on your website content and mind triggers. Our AI will create compelling ad content designed to engage your audience.
          </p>
          <Button 
            onClick={onGenerateAds} 
            disabled={isGenerating}
            className="min-w-[200px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ads...
              </>
            ) : (
              <>Generate Instagram Ads</>
            )}
          </Button>
          {mindTrigger && (
            <div className="mt-4 text-sm p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
              <span className="font-medium">Using mind trigger:</span> {mindTrigger}
            </div>
          )}
        </div>
      ) : (
        <AdsList
          metaAds={metaAds}
          analysisResult={analysisResult}
          loadingImageIndex={loadingImageIndex}
          onGenerateImage={handleGenerateImage}
          onUpdateAd={handleUpdateAd}
        />
      )}
    </div>
  );
};

export default MetaAdsTab;
