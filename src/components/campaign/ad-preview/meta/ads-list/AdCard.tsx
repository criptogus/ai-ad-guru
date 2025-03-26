
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MetaAdCard } from "../card";

interface AdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  loadingImageIndex: number | null;
  onGenerateImage: (ad: MetaAd, index: number) => Promise<void>;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const AdCard: React.FC<AdCardProps> = ({
  ad,
  index,
  analysisResult,
  loadingImageIndex,
  onGenerateImage,
  onUpdateAd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localAd, setLocalAd] = useState<MetaAd>(ad);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedAd: MetaAd) => {
    if (onUpdateAd) {
      onUpdateAd(index, updatedAd);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalAd(ad);
    setIsEditing(false);
  };

  const handleCopy = () => {
    const text = `Headline: ${ad.headline}\n\nPrimary Text: ${ad.primaryText}\n\nDescription: ${ad.description}`;
    navigator.clipboard.writeText(text);
  };

  const handleGenerateImage = async () => {
    return onGenerateImage(ad, index);
  };

  return (
    <MetaAdCard 
      ad={ad} 
      index={index} 
      analysisResult={analysisResult}
      isEditing={isEditing}
      isGeneratingImage={loadingImageIndex === index}
      loadingImageIndex={loadingImageIndex}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onCopy={handleCopy}
      onGenerateImage={handleGenerateImage}
      onUpdate={onUpdateAd ? (updatedAd) => onUpdateAd(index, updatedAd) : undefined}
    />
  );
};

export default AdCard;
