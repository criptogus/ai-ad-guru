
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
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerateImage = async () => {
    await onGenerateImage(ad, index);
  };

  const handleUpdateAd = (updatedAd: MetaAd) => {
    if (onUpdate) {
      console.log(`MetaAdCard (index: ${index}) - Updating ad with new image URL:`, updatedAd.imageUrl);
      onUpdate(index, updatedAd);
    }
  };

  const handleCopy = () => {
    // Create a text representation of the ad that can be copied
    const adText = `Headline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\nDescription: ${ad.description}`;
    navigator.clipboard.writeText(adText);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <MetaAdCardHeader 
          index={index}
          isEditing={isEditing}
          onCopy={handleCopy}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
        
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
