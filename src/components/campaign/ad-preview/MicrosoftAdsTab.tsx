
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import { MicrosoftAdPreview } from "./microsoft";

interface MicrosoftAdsTabProps {
  microsoftAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateMicrosoftAd: (updatedAds: GoogleAd[]) => void;
  analysisResult: WebsiteAnalysisResult;
}

const MicrosoftAdsTab: React.FC<MicrosoftAdsTabProps> = ({
  microsoftAds,
  isGenerating,
  onGenerateAds,
  onUpdateMicrosoftAd,
  analysisResult,
}) => {
  const hasAds = microsoftAds && microsoftAds.length > 0;
  
  // Get domain for ad preview
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return 'example.com';
    }
  };
  
  const domain = analysisResult?.websiteUrl ? getDomain(analysisResult.websiteUrl) : 'example.com';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Microsoft Ads</CardTitle>
        <CardDescription>
          Generate and customize your Microsoft ad creatives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasAds ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">
              No Microsoft Ads generated yet.
            </p>
            <Button
              onClick={onGenerateAds}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Microsoft Ads"}
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {microsoftAds.map((ad, index) => (
              <Card key={index} className="border-accent/50">
                <CardHeader>
                  <CardTitle>Ad Variation {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-2 bg-white max-w-md mx-auto">
                    <MicrosoftAdPreview ad={ad} domain={domain} />
                  </div>
                  
                  <div className="space-y-2">
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

export default MicrosoftAdsTab;
