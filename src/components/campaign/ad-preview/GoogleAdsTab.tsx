
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw, Plus } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { GoogleAd } from "@/hooks/adGeneration";
import GoogleAdCard from "./google/GoogleAdCard";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[] | null; // Change to accept null
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
  mindTrigger,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Ensure googleAds is always an array
  const safeAds = Array.isArray(googleAds) ? googleAds : [];

  const handleEditStart = (index: number) => {
    setEditingIndex(index);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
  };

  const handleEditSave = (index: number, updatedAd: GoogleAd) => {
    onUpdateGoogleAd(index, updatedAd);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with generate button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Google Search Ads</h3>
          <p className="text-sm text-muted-foreground">
            Generate and customize Google text ads for your campaign
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

      {/* Loading state */}
      {isGenerating && safeAds.length === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">
              Generating Google search ads using AI...
            </p>
            {mindTrigger && (
              <p className="text-sm text-muted-foreground mt-2">
                Applying Mind Trigger: <span className="font-medium">{mindTrigger}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {!isGenerating && safeAds.length === 0 && (
        <Card>
          <CardContent className="py-10 flex flex-col items-center justify-center">
            <p className="text-muted-foreground mb-4">
              No Google ads generated yet
            </p>
            <Button onClick={onGenerateAds} disabled={isGenerating}>
              Generate Google Search Ads
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ads list */}
      {safeAds.length > 0 && (
        <div className="space-y-6">
          {safeAds.map((ad, index) => (
            <GoogleAdCard 
              key={index}
              ad={ad}
              index={index}
              domain={extractDomain(analysisResult.websiteUrl)}
              onUpdateAd={(updatedAd) => onUpdateGoogleAd(index, updatedAd)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to extract domain from URL
const extractDomain = (url: string): string => {
  try {
    if (!url) return 'example.com';
    const domain = new URL(url).hostname;
    return domain.startsWith('www.') ? domain.slice(4) : domain;
  } catch (e) {
    return url || 'example.com';
  }
};

export default GoogleAdsTab;
