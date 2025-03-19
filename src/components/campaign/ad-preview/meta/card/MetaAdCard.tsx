
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import InstagramPreview from "../InstagramPreview";
import MetaAdCardHeader from "./MetaAdCardHeader";
import AdDetailsSection from "./AdDetailsSection";

interface MetaAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdate?: (index: number, updatedAd: MetaAd) => void;
}

const MetaAdCard: React.FC<MetaAdCardProps> = ({
  ad,
  index,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdate
}) => {
  const handleGenerateImage = async () => {
    await onGenerateImage(ad, index);
  };

  const handleUpdateAd = (updatedAd: MetaAd) => {
    if (onUpdate) {
      console.log(`MetaAdCard (index: ${index}) - Updating ad with new image URL:`, updatedAd.imageUrl);
      onUpdate(index, updatedAd);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <MetaAdCardHeader title={`Instagram Ad ${index + 1}`} />
        
        <div className="grid md:grid-cols-2 gap-4 p-4">
          {/* Instagram Preview */}
          <div>
            <InstagramPreview 
              ad={ad}
              companyName={analysisResult?.companyName || "Your Company"}
              loadingImageIndex={loadingImageIndex}
              index={index}
              onGenerateImage={handleGenerateImage}
              onUpdateAd={handleUpdateAd}
            />
          </div>
          
          {/* Ad Details Editor */}
          <div>
            <AdDetailsSection 
              ad={ad} 
              onUpdate={onUpdate ? (updatedAd) => onUpdate(index, updatedAd) : undefined}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaAdCard;
