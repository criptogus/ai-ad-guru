
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Loader2, WandSparkles } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import MetaAdCard from "./meta/card/MetaAdCard";
import EmptyAdsState from "./EmptyAdsState";
import { PreviewLayout, DevicePreview, AdFormat } from "./GoogleAdsTab";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateMetaAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
  previewLayout?: PreviewLayout;
  devicePreview?: DevicePreview;
  adFormat?: AdFormat;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({
  metaAds,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateMetaAds,
  onGenerateImage,
  onUpdateAd,
  previewLayout = "split-horizontal",
  devicePreview = "desktop",
  adFormat = "feed"
}) => {
  const handleUpdateAd = (index: number, updatedAd: MetaAd) => {
    if (onUpdateAd) {
      onUpdateAd(index, updatedAd);
    }
  };

  const handleGenerateImage = async (index: number) => {
    if (metaAds[index]) {
      await onGenerateImage(metaAds[index], index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
        <div className="flex items-center gap-2 text-sm text-purple-800 dark:text-purple-200">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-purple-500"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
          <span className="font-medium">Instagram Ads</span>
          - Generate eye-catching image ads for Instagram with AI
        </div>
      </div>

      {metaAds.length === 0 ? (
        <EmptyAdsState
          title="No Instagram Ads Created Yet"
          description="Generate Instagram ad variations optimized for engagement with our AI."
          buttonText="Generate Instagram Ads"
          isLoading={isGenerating}
          onClick={onGenerateMetaAds}
          icon={<WandSparkles className="h-12 w-12 text-purple-500 mb-2" />}
        />
      ) : (
        <div className="space-y-4">
          <Button
            onClick={onGenerateMetaAds}
            disabled={isGenerating}
            variant="outline"
            className="w-full mb-4"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Instagram Ads...
              </>
            ) : (
              <>
                <WandSparkles className="mr-2 h-4 w-4" />
                Regenerate Instagram Ads
              </>
            )}
          </Button>

          <div className="space-y-6">
            {metaAds.map((ad, index) => (
              <MetaAdCard
                key={index}
                ad={ad}
                index={index}
                analysisResult={analysisResult}
                loadingImageIndex={loadingImageIndex}
                onGenerateImage={() => handleGenerateImage(index)}
                onUpdate={(updatedAd) => handleUpdateAd(index, updatedAd)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaAdsTab;
