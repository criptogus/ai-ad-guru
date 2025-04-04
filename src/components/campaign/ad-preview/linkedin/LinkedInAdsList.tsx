
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Plus } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCard from "./LinkedInAdCard";

interface LinkedInAdsListProps {
  ads: any[] | null; // Change to accept null
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
  onGenerateImage: (ad: any, index: number) => Promise<void>;
  onUpdateLinkedInAd: (index: number, updatedAd: any) => void;
  mindTrigger?: string;
}

const LinkedInAdsList: React.FC<LinkedInAdsListProps> = ({
  ads,
  analysisResult,
  isGenerating,
  loadingImageIndex,
  onGenerateAds,
  onGenerateImage,
  onUpdateLinkedInAd,
  mindTrigger
}) => {
  // Ensure ads is always an array
  const safeAds = Array.isArray(ads) ? ads : [];
  
  const handleGenerateImage = async (ad: any, index: number) => {
    if (onGenerateImage) {
      await onGenerateImage(ad, index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">LinkedIn Ads</h3>
          <p className="text-sm text-muted-foreground">
            Generate and customize LinkedIn ads for your campaign
          </p>
        </div>
        
        <Button
          onClick={onGenerateAds}
          disabled={isGenerating}
          variant={safeAds.length > 0 ? "outline" : "default"}
          className="ml-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : safeAds.length > 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Ads
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Generate Ads
            </>
          )}
        </Button>
      </div>

      {/* Show loading state */}
      {isGenerating && safeAds.length === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">
              Generating LinkedIn ads using AI...
            </p>
            {mindTrigger && (
              <p className="text-sm text-muted-foreground mt-2">
                Applying Mind Trigger: <span className="font-medium">{mindTrigger}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Show empty state */}
      {!isGenerating && safeAds.length === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">
              No LinkedIn ads generated yet
            </p>
            <Button onClick={onGenerateAds} disabled={isGenerating}>
              Generate LinkedIn Ads
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Show ads */}
      {safeAds.length > 0 && (
        <div className="space-y-6">
          {safeAds.map((ad, index) => (
            <LinkedInAdCard
              key={index}
              ad={ad}
              index={index}
              analysisResult={analysisResult}
              isGeneratingImage={loadingImageIndex === index}
              onGenerateImage={() => handleGenerateImage(ad, index)}
              onUpdateAd={(updatedAd) => onUpdateLinkedInAd(index, updatedAd)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkedInAdsList;
