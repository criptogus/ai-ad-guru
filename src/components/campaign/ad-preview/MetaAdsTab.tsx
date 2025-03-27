
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import InstagramAdsPreview from "./meta/InstagramAdsPreview";

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Generate Ads Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Instagram Ads</h3>
          {mindTrigger && (
            <p className="text-sm text-muted-foreground">
              Using mind trigger: <span className="font-medium">{mindTrigger}</span>
            </p>
          )}
        </div>
        <Button 
          onClick={onGenerateAds} 
          disabled={isGenerating}
          className="min-w-[140px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : metaAds.length > 0 ? (
            "Regenerate Ads"
          ) : (
            "Generate Ads"
          )}
        </Button>
      </div>

      {/* Mobile-First Instagram Ads Preview */}
      {metaAds.length > 0 ? (
        <InstagramAdsPreview
          ads={metaAds}
          companyName={analysisResult.companyName}
          loadingImageIndex={loadingImageIndex}
          onGenerateImage={onGenerateImage}
          onUpdateAd={onUpdateMetaAd}
        />
      ) : !isGenerating ? (
        <div className="border border-dashed rounded-md p-8 text-center bg-background">
          <p className="text-muted-foreground mb-4">No Instagram Ads generated yet</p>
          <Button onClick={onGenerateAds} variant="outline">
            Generate Instagram Ads
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default MetaAdsTab;
