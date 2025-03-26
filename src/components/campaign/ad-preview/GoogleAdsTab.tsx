
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import GoogleAdCard from "./google/GoogleAdCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  analysisResult: WebsiteAnalysisResult;
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
  onUpdateGoogleAd: (ads: GoogleAd[]) => void;
}

const GoogleAdsTab: React.FC<GoogleAdsTabProps> = ({
  googleAds,
  analysisResult,
  isGenerating,
  onGenerateAds,
  onUpdateGoogleAd,
}) => {
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);
  const [localAds, setLocalAds] = useState<GoogleAd[]>([]);

  useEffect(() => {
    setLocalAds(googleAds);
  }, [googleAds]);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const handleEditAd = (index: number) => {
    setEditingAdIndex(index);
  };

  const handleSaveAd = (index: number, updatedAd: GoogleAd) => {
    const newAds = [...localAds];
    newAds[index] = updatedAd;
    setLocalAds(newAds);
    onUpdateGoogleAd(newAds);
    setEditingAdIndex(null);
    
    toast.success("Ad updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingAdIndex(null);
    setLocalAds(googleAds);
  };

  const handleCopyAd = (ad: GoogleAd) => {
    const text = `Headlines:\n${ad.headlines.join('\n')}\n\nDescriptions:\n${ad.descriptions.join('\n')}`;
    
    navigator.clipboard.writeText(text);
    toast.success("Ad text copied to clipboard");
  };

  const handleGenerateAds = async () => {
    try {
      await onGenerateAds();
    } catch (error) {
      console.error("Error generating Google ads:", error);
    }
  };

  const domain = analysisResult?.websiteUrl ? getDomain(analysisResult.websiteUrl) : "example.com";

  return (
    <div className="space-y-4">
      {googleAds.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-6">
              <h3 className="text-lg font-medium">No Google Ads Created Yet</h3>
              <p className="text-muted-foreground">
                Generate Google ads based on your website analysis.
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
                  "Generate Google Ads"
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
            <h2 className="text-lg font-medium">Google Ad Variations</h2>
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
              <GoogleAdCard
                key={index}
                index={index}
                ad={ad}
                domain={domain}
                isEditing={editingAdIndex === index}
                onEdit={() => handleEditAd(index)}
                onSave={(updatedAd) => handleSaveAd(index, updatedAd)}
                onCancel={handleCancelEdit}
                onCopy={() => handleCopyAd(ad)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GoogleAdsTab;
