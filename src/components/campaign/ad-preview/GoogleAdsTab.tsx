
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getDomainFromUrl } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  mindTrigger?: string;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
  mindTrigger
}) => {
  const domain = getDomainFromUrl(analysisResult.websiteUrl || "example.com");

  return (
    <div className="space-y-6">
      {mindTrigger && (
        <Alert className="mb-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <AlertTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Active Mind Trigger
          </AlertTitle>
          <AlertDescription className="text-blue-600 dark:text-blue-300">
            {mindTrigger}
          </AlertDescription>
        </Alert>
      )}
      
      {googleAds.length === 0 ? (
        <div className="text-center p-8">
          <h3 className="text-lg font-medium mb-2">No Google Ads Generated Yet</h3>
          <p className="text-muted-foreground mb-4">
            Generate Google text ads based on your website analysis
          </p>
          <Button 
            onClick={onGenerateAds} 
            disabled={isGenerating}
            className="mx-auto"
          >
            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Google Ads
          </Button>
          <div className="text-xs text-muted-foreground mt-2">
            This will use 5 credits
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Google Ad Variations</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateAds}
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
          
          {googleAds.map((ad, index) => (
            <div key={`google-ad-${index}`} className="border rounded-md p-4">
              <div className="mb-2">
                <div className="font-medium text-blue-600">{ad.headline1} | {ad.headline2} | {ad.headline3}</div>
                <div className="text-green-700 text-sm">{domain}</div>
                <div className="text-sm">{ad.description1}</div>
                <div className="text-sm">{ad.description2}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  const updatedAd = { ...ad };
                  onUpdateGoogleAd(index, updatedAd);
                }}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleAdsTab;
