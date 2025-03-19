import React, { useState, useEffect } from "react";
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
  const [localAd, setLocalAd] = useState<MetaAd>(ad);
  
  useEffect(() => {
    setLocalAd(ad);
  }, [ad]);

  const handleGenerateImage = async () => {
    await onGenerateImage(localAd, index);
  };

  const handleUpdateAd = (updatedAd: MetaAd) => {
    setLocalAd(updatedAd);
    
    if (onUpdate) {
      console.log(`MetaAdCard (index: ${index}) - Updating ad with new values:`, updatedAd);
      onUpdate(index, updatedAd);
    }
  };

  const handleCopy = () => {
    const adText = `Headline: ${localAd.headline}\nPrimary Text: ${localAd.primaryText}\nDescription: ${localAd.description}`;
    navigator.clipboard.writeText(adText);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(index, localAd);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalAd(ad);
  };

  useEffect(() => {
    console.log(`MetaAdCard ${index} rendering with:`, {
      adImageUrl: localAd.imageUrl,
      isLoading: loadingImageIndex === index,
      isEditing,
    });
  }, [localAd, loadingImageIndex, index, isEditing]);

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
          <div>
            <InstagramPreview 
              ad={localAd}
              companyName={analysisResult?.companyName || "Your Company"}
              loadingImageIndex={loadingImageIndex}
              index={index}
              onGenerateImage={handleGenerateImage}
              onUpdateAd={handleUpdateAd}
            />
          </div>
          
          <div>
            <AdDetailsSection 
              ad={localAd} 
              onUpdate={handleUpdateAd}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaAdCard;
