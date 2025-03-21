import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import AdOptimizer from "./AdOptimizer";
import { Button } from "@/components/ui/button";

export type PreviewLayout = "split-horizontal" | "split-vertical" | "preview-only" | "edit-only";
export type DevicePreview = "desktop" | "mobile" | "tablet";
export type AdFormat = "square" | "vertical" | "horizontal" | "story" | "feed" | "search" | "display";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateGoogleAd: (updatedAds: GoogleAd[]) => void;
  analysisResult: any;
  previewLayout?: PreviewLayout;
  devicePreview?: DevicePreview;
  adFormat?: AdFormat;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
  analysisResult,
  previewLayout = "split-horizontal",
  devicePreview = "desktop",
  adFormat = "search"
}) => {
  const hasAds = googleAds && googleAds.length > 0;

  // Fix the type error by converting the index to the GoogleAd object
  const handleOptimizedAdsGenerated = (optimizedAds: any[]) => {
    // Map the optimized ads to the existing ads array
    const updatedAds = optimizedAds.map(optimizedAd => {
      const originalAd = googleAds[optimizedAd.originalAdIndex];
      return {
        ...originalAd,
        headlines: optimizedAd.headlines || originalAd.headlines,
        descriptions: optimizedAd.descriptions || originalAd.descriptions,
        isOptimized: true,
        optimizationRationale: optimizedAd.rationale
      };
    });

    onUpdateGoogleAd(updatedAds);
  };

  // Adjust the layout based on previewLayout prop
  const renderContent = () => {
    // If preview-only, just show the preview
    if (previewLayout === "preview-only") {
      return (
        <div className="p-4 border rounded-md bg-muted/20">
          <p className="text-center text-muted-foreground">Google Ad Preview</p>
          {/* Here we would render a proper Google Ad preview component */}
        </div>
      );
    }

    // If edit-only, just show the editing interface
    if (previewLayout === "edit-only") {
      return (
        <div className="space-y-4">
          {renderAdsContent()}
        </div>
      );
    }

    // Otherwise render both
    return renderAdsContent();
  };

  const renderAdsContent = () => {
    if (!hasAds) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">
            No Google Ads generated yet.
          </p>
          <Button
            onClick={onGenerateAds}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Google Ads"}
          </Button>
        </div>
      );
    } 
    
    return (
      <div className="grid gap-4">
        {googleAds.map((ad, index) => (
          <Card key={index} className="border-accent/50">
            <CardHeader>
              <CardTitle>Ad Variation {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">Headlines:</p>
              <ul className="list-disc pl-5">
                {ad.headlines.map((headline, i) => (
                  <li key={i} className="text-sm">{headline}</li>
                ))}
              </ul>
              <p className="text-sm font-medium">Descriptions:</p>
              <ul className="list-disc pl-5">
                {ad.descriptions.map((description, i) => (
                  <li key={i} className="text-sm">{description}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Ads</CardTitle>
        <CardDescription>
          Generate and customize your Google Ads creatives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderContent()}

        {hasAds && (
          <AdOptimizer
            adType="google"
            ads={googleAds}
            onOptimizedAdsGenerated={handleOptimizedAdsGenerated}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAdsTab;
