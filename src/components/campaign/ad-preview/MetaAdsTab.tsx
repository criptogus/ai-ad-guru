
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import AdVariationCard from "../AdVariationCard";

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

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number, updatedAd: MetaAd) => {
    onUpdateMetaAd(index, updatedAd);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleCopy = (ad: MetaAd) => {
    // Create formatted text for clipboard
    const adText = `Headline: ${ad.headline}

${ad.primaryText}

CTA: ${ad.description}

${ad.hashtags ? '\nHashtags: #' + ad.hashtags.join(' #') : ''}`;

    navigator.clipboard.writeText(adText);
  };

  const handleRegenerateImage = (ad: MetaAd, index: number) => {
    onGenerateImage(ad, index);
  };

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

      {/* Ad Preview Grid */}
      {metaAds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {metaAds.map((ad, index) => (
            <AdVariationCard
              key={index}
              platform="meta"
              ad={ad}
              analysisResult={analysisResult}
              isEditing={editingIndex === index}
              index={index}
              onEdit={() => handleEdit(index)}
              onSave={() => handleSave(index, ad)}
              onCancel={handleCancel}
              onCopy={() => handleCopy(ad)}
              onRegenerate={() => handleRegenerateImage(ad, index)}
              onUpdate={(updatedAd) => onUpdateMetaAd(index, updatedAd as MetaAd)}
            />
          ))}
        </div>
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
