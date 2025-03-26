
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import InstagramPreview from "./InstagramPreview";
import MetaAdCardHeader from "./card/MetaAdCardHeader";
import AdDetailsSection from "./card/AdDetailsSection";

interface MetaAdCardProps {
  ad: MetaAd;
  index: number;
  companyName: string;
  isEditing?: boolean;
  isGeneratingImage?: boolean;
  onEdit?: () => void;
  onSave?: (updatedAd: MetaAd) => void;
  onCancel?: () => void;
  onCopy?: () => void;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
}

const MetaAdCard: React.FC<MetaAdCardProps> = ({
  ad,
  index,
  companyName,
  isEditing: externalIsEditing,
  isGeneratingImage = false,
  onEdit: externalOnEdit,
  onSave: externalOnSave,
  onCancel: externalOnCancel,
  onCopy: externalOnCopy,
  onGenerateImage,
  onUpdateAd
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [localAd, setLocalAd] = useState<MetaAd>(ad);
  
  // Use external props if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  
  useEffect(() => {
    setLocalAd(ad);
  }, [ad]);

  const handleUpdateAd = (updatedAd: MetaAd) => {
    setLocalAd(updatedAd);
    
    if (onUpdateAd) {
      console.log(`MetaAdCard (index: ${index}) - Updating ad with new values:`, updatedAd);
      onUpdateAd(updatedAd);
    }
  };

  const handleCopy = () => {
    if (externalOnCopy) {
      externalOnCopy();
    } else {
      const adText = `Headline: ${localAd.headline}\nPrimary Text: ${localAd.primaryText}\nDescription: ${localAd.description}`;
      navigator.clipboard.writeText(adText);
    }
  };

  const handleEdit = () => {
    if (externalOnEdit) {
      externalOnEdit();
    } else {
      setInternalIsEditing(true);
    }
  };

  const handleSave = () => {
    if (externalOnSave) {
      externalOnSave(localAd);
    } else {
      setInternalIsEditing(false);
      if (onUpdateAd) {
        onUpdateAd(localAd);
      }
    }
  };

  const handleCancel = () => {
    if (externalOnCancel) {
      externalOnCancel();
    } else {
      setInternalIsEditing(false);
      setLocalAd(ad);
    }
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
          <div>
            <InstagramPreview 
              ad={localAd}
              companyName={companyName}
              loadingImageIndex={isGeneratingImage ? index : null}
              index={index}
              onGenerateImage={onGenerateImage}
              onUpdateAd={handleUpdateAd}
            />
          </div>
          
          <div>
            <AdDetailsSection 
              ad={localAd} 
              onUpdate={handleUpdateAd}
              isEditing={isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaAdCard;
