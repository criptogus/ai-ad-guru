
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import InstagramAdsPreview from "./InstagramAdsPreview";

interface MetaAdsListProps {
  ads: MetaAd[];
  companyName: string;
  isLoading?: boolean;
  loadingImageIndex: number | null;
  onGenerateAds?: () => Promise<void>;
  onGenerateImage?: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const MetaAdsList: React.FC<MetaAdsListProps> = ({
  ads,
  companyName,
  isLoading = false,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateAd,
}) => {
  const [viewMode, setViewMode] = useState<"feed" | "story" | "reel">("feed");

  const handleGenerateImage = async (ad: MetaAd, index: number): Promise<void> => {
    if (onGenerateImage) {
      await onGenerateImage(ad, index);
    }
  };

  return (
    <div className="space-y-4">
      {/* If there are already generated ads, show them as previews */}
      {ads.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Instagram Ads Preview</h3>
            <div className="flex gap-2">
              {onGenerateAds && (
                <Button 
                  variant="outline" 
                  onClick={onGenerateAds}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Regenerate Ads
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          <InstagramAdsPreview 
            ads={ads}
            companyName={companyName}
            loadingImageIndex={loadingImageIndex}
            onGenerateImage={handleGenerateImage}
            onUpdateAd={onUpdateAd || (() => {})}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 border border-dashed rounded-lg">
          <p className="mb-4 text-muted-foreground">No Instagram ads generated yet</p>
          {onGenerateAds && (
            <Button 
              onClick={onGenerateAds}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Instagram Ads"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MetaAdsList;
