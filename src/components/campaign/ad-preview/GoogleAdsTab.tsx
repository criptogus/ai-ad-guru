
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight, Sparkles, Loader2 } from "lucide-react";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdCard from "./google/GoogleAdCard";
import TriggerGallery from "@/components/mental-triggers/TriggerGallery";
import EmptyAdsState from "./EmptyAdsState";
import { ScrollArea } from "@/components/ui/scroll-area";
import { normalizeGoogleAd } from "@/lib/utils";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: (mindTrigger?: string) => Promise<void>;
  onUpdateGoogleAd: (index: number, updatedAd: GoogleAd) => void;
  analysisResult: WebsiteAnalysisResult;
  mindTrigger?: string;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
  analysisResult,
  mindTrigger: initialMindTrigger,
}) => {
  const [showTriggers, setShowTriggers] = useState(false);
  const [open, setOpen] = useState(false);

  // Sync the selected mind trigger locally; initialize from prop for backward compatibility
  const [selectedMindTrigger, setSelectedMindTrigger] = useState<string | undefined>(initialMindTrigger);

  // Use company name or fallback to domain for preview
  const companyName = analysisResult?.companyName ?? "example.com";

  const handleGenerateClick = async () => {
    try {
      console.log("Generating Google Ads with mind trigger:", selectedMindTrigger);
      await onGenerateAds(selectedMindTrigger);
      console.log("Google Ads generated successfully");
    } catch (error) {
      console.error("Error generating Google Ads:", error);
    }
  };

  const handleSelectTrigger = (trigger: string) => {
    console.log("Selected trigger:", trigger);
    setSelectedMindTrigger(trigger);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Google Search Ads</h3>
          <p className="text-sm text-muted-foreground">
            Create text ads for Google Search Network
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant="outline"
            onClick={() => setShowTriggers(!showTriggers)}
            size="sm"
          >
            {showTriggers ? "Hide Mind Triggers" : "Show Mind Triggers"}
          </Button>

          <Button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            size="sm"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Ads
              </>
            )}
          </Button>
        </div>
      </div>

      {showTriggers && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-2">Ad Triggers Library</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Click a trigger to add it to the current trigger selection
            </p>
            <ScrollArea className="h-32 w-full">
              <TriggerGallery 
                open={open} 
                onOpenChange={setOpen}
                onSelectTrigger={handleSelectTrigger}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {selectedMindTrigger && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <span className="font-semibold">Selected Mind Trigger:</span> {selectedMindTrigger}
          </p>
        </div>
      )}

      {googleAds?.length > 0 ? (
        <div className="space-y-6">
          {googleAds.map((ad, index) => {
            // Always normalize the ad to ensure it has headlines and descriptions arrays
            const normalizedAd = normalizeGoogleAd(ad);
            return (
              <GoogleAdCard
                key={`google-ad-${index}`}
                ad={normalizedAd}
                index={index}
                domain={companyName}
                onUpdateAd={(updatedAd) => onUpdateGoogleAd(index, normalizeGoogleAd(updatedAd))}
              />
            );
          })}
        </div>
      ) : (
        <EmptyAdsState
          platform="google"
          isGenerating={isGenerating}
          onGenerate={handleGenerateClick}
        />
      )}
    </div>
  );
};

export default GoogleAdsTab;

