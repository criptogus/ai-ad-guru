
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MetaAdCard from "./meta/MetaAdCard";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateMetaAd: (ads: MetaAd[]) => void;
}

const MetaAdsTab: React.FC<MetaAdsTabProps> = ({
  metaAds,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateMetaAd,
}) => {
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);
  const [localAds, setLocalAds] = useState<MetaAd[]>([]);

  useEffect(() => {
    setLocalAds(metaAds);
  }, [metaAds]);

  const handleEditAd = (index: number) => {
    setEditingAdIndex(index);
  };

  const handleSaveAd = (index: number, updatedAd: MetaAd) => {
    const newAds = [...localAds];
    newAds[index] = updatedAd;
    setLocalAds(newAds);
    onUpdateMetaAd(newAds);
    setEditingAdIndex(null);
    
    toast.success("Meta ad updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingAdIndex(null);
    setLocalAds(metaAds);
  };

  const handleCopyAd = (ad: MetaAd) => {
    const text = `Headline: ${ad.headline}\n\nPrimary Text: ${ad.primaryText}\n\nDescription: ${ad.description}`;
    
    navigator.clipboard.writeText(text);
    toast.success("Meta ad text copied to clipboard");
  };

  const handleGenerateImage = async (ad: MetaAd, index: number) => {
    try {
      await onGenerateImage(ad, index);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  const handleGenerateAds = async () => {
    try {
      await onGenerateAds();
    } catch (error) {
      console.error("Error generating Meta ads:", error);
    }
  };

  return (
    <div className="space-y-4">
      {metaAds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-6">
              <h3 className="text-lg font-medium">No Instagram Ads Created Yet</h3>
              <p className="text-muted-foreground">
                Generate Instagram ads based on your website analysis.
              </p>
              <Button 
                onClick={handleGenerateAds} 
                disabled={isGenerating}
                className="mt-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Ads...
                  </>
                ) : (
                  "Generate Instagram Ads"
                )}
              </Button>
              <div className="text-xs text-muted-foreground mt-2">
                This will use 5 credits
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Instagram Ad Variations</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateAds}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating...
                </>
              ) : (
                "Regenerate Ads"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localAds.map((ad, index) => (
              <MetaAdCard
                key={index}
                index={index}
                ad={ad}
                companyName={analysisResult.companyName}
                isEditing={editingAdIndex === index}
                isGeneratingImage={loadingImageIndex === index}
                onEdit={() => handleEditAd(index)}
                onSave={(updatedAd) => handleSaveAd(index, updatedAd)}
                onCancel={handleCancelEdit}
                onCopy={() => handleCopyAd(ad)}
                onGenerateImage={() => handleGenerateImage(ad, index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MetaAdsTab;
