
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { InstagramPreview } from "./meta";

interface MetaAdsTabProps {
  metaAds: MetaAd[];
  isGenerating: boolean;
  loadingImageIndex: number | null;
  onGenerateAds: () => Promise<void>;
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
  const hasAds = metaAds && metaAds.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instagram Ads</CardTitle>
        <CardDescription>
          Generate and customize your Instagram ad creatives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAds ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">
              No Instagram Ads generated yet.
            </p>
            <Button
              onClick={onGenerateAds}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Instagram Ads"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {metaAds.map((ad, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ad Variation {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-2 bg-white">
                      <InstagramPreview 
                        ad={ad} 
                        companyName={analysisResult.companyName} 
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Primary Text</h4>
                        <p className="text-sm">{ad.primaryText}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Headline</h4>
                        <p className="text-sm">{ad.headline}</p>
                      </div>
                      
                      {!ad.imageUrl && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Image Prompt</h4>
                          <p className="text-sm">{ad.imagePrompt}</p>
                          <Button
                            onClick={() => onGenerateImage(ad, index)}
                            disabled={loadingImageIndex !== null}
                            size="sm"
                            variant="secondary"
                            className="gap-1"
                          >
                            {loadingImageIndex === index ? (
                              <>
                                <Loader className="h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="h-4 w-4" />
                                Generate Image
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaAdsTab;
