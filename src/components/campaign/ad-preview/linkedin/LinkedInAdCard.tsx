
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdPreview from "./LinkedInAdPreview";
import LinkedInAdCardHeader from "./LinkedInAdCardHeader";
import LinkedInAdDetails from "./LinkedInAdDetails";
import LinkedInPreviewControls from "./LinkedInPreviewControls";

interface LinkedInAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage?: boolean;
  onGenerateImage?: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (updatedAd: MetaAd) => void;
  onCancel?: () => void;
  onCopy?: () => void;
}

const LinkedInAdCard: React.FC<LinkedInAdCardProps> = ({
  ad,
  index,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  onUpdateAd,
  isEditing: externalIsEditing,
  onEdit: externalOnEdit,
  onSave: externalOnSave,
  onCancel: externalOnCancel,
  onCopy: externalOnCopy
}) => {
  const [internalIsEditing, setInternalIsEditing] = useState(false);
  const [previewType, setPreviewType] = useState<"feed" | "sidebar" | "message">("feed");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [imageFormat, setImageFormat] = useState<string>("landscape");
  const [localAd, setLocalAd] = useState<MetaAd>(ad);
  
  // Use external props if provided, otherwise use internal state
  const isEditing = externalIsEditing !== undefined ? externalIsEditing : internalIsEditing;
  
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
  
  const handleCopy = () => {
    if (externalOnCopy) {
      externalOnCopy();
    } else {
      const textToCopy = `Headline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\nDescription: ${ad.description}`;
      navigator.clipboard.writeText(textToCopy);
    }
  };
  
  const handleUpdateAd = (updatedAd: MetaAd) => {
    setLocalAd(updatedAd);
    if (onUpdateAd) {
      onUpdateAd(updatedAd);
    }
  };

  return (
    <Card className="overflow-hidden">
      <LinkedInAdCardHeader 
        adIndex={index}
        isEditing={isEditing}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      
      <CardContent className="p-4 grid gap-6">
        <LinkedInPreviewControls 
          previewType={previewType}
          deviceView={deviceView}
          imageFormat={imageFormat}
          onPreviewTypeChange={setPreviewType}
          onDeviceViewChange={setDeviceView}
          onImageFormatChange={setImageFormat}
        />
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
            <LinkedInAdPreview 
              ad={isEditing ? localAd : ad}
              analysisResult={analysisResult}
              isGeneratingImage={isGeneratingImage}
              onGenerateImage={onGenerateImage}
              imageFormat={imageFormat}
              previewType={previewType}
              deviceView={deviceView}
              onUpdateAd={handleUpdateAd}
            />
          </div>
          
          <div>
            <LinkedInAdDetails 
              ad={localAd}
              isEditing={isEditing}
              onUpdateAd={handleUpdateAd}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdCard;
