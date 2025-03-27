
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import AdVariationCard from "../AdVariationCard";

interface GoogleAdsTabProps {
  googleAds: GoogleAd[];
  isGenerating: boolean;
  onGenerateAds: () => Promise<void>;
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
  mindTrigger
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSave = (index: number, updatedAd: GoogleAd) => {
    onUpdateGoogleAd(index, updatedAd);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleCopy = (ad: GoogleAd) => {
    // Create formatted text for clipboard
    const adText = `Headlines:
${ad.headlines?.join('\n') || `${ad.headline1}\n${ad.headline2}\n${ad.headline3}`}

Descriptions:
${ad.descriptions?.join('\n') || `${ad.description1}\n${ad.description2}`}`;

    navigator.clipboard.writeText(adText);
  };

  return (
    <div className="space-y-6">
      {/* Generate Ads Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Google Ads</h3>
          {mindTrigger && (
            <p className="text-sm text-muted-foreground">
              Using mind trigger: <span className="font-medium">{mindTrigger}</span>
            </p>
          )}
        </div>
        <Button 
          onClick={onGenerateAds} 
          disabled={isGenerating}
          className="min-w-[140px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : googleAds.length > 0 ? (
            "Regenerate Ads"
          ) : (
            "Generate Ads"
          )}
        </Button>
      </div>

      {/* Ad Preview Grid */}
      {googleAds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {googleAds.map((ad, index) => (
            <AdVariationCard
              key={index}
              platform="google"
              ad={ad}
              analysisResult={analysisResult}
              isEditing={editingIndex === index}
              index={index}
              onEdit={() => handleEdit(index)}
              onSave={() => handleSave(index, ad)}
              onCancel={handleCancel}
              onCopy={() => handleCopy(ad)}
              onUpdate={(updatedAd) => onUpdateGoogleAd(index, updatedAd as GoogleAd)}
            />
          ))}
        </div>
      ) : !isGenerating ? (
        <div className="border border-dashed rounded-md p-8 text-center bg-background">
          <p className="text-muted-foreground mb-4">No Google Ads generated yet</p>
          <Button onClick={onGenerateAds} variant="outline">
            Generate Google Ads
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default GoogleAdsTab;
