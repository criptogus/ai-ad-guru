
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { MetaAdCardProps } from "./types";
import AdCardHeader from "./AdCardHeader";
import AdPreviewSection from "./AdPreviewSection";
import AdEditorSection from "./AdEditorSection";

const MetaAdCard: React.FC<MetaAdCardProps> = ({
  ad,
  index,
  analysisResult,
  isEditing,
  isGeneratingImage,
  loadingImageIndex,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onGenerateImage,
  onUpdate
}) => {
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);
  const companyName = analysisResult.companyName || "Your Company";

  useEffect(() => {
    setEditedAd(ad);
  }, [ad]);

  const handleUpdate = (updatedAd: MetaAd) => {
    setEditedAd(updatedAd);
  };

  const handleSelectTrigger = (trigger: string) => {
    // If we're editing, add the trigger to the primaryText
    if (isEditing) {
      setEditedAd({
        ...editedAd,
        primaryText: editedAd.primaryText 
          ? `${editedAd.primaryText}\n\n${trigger}`
          : trigger
      });
    }
  };

  const handleSaveClick = () => {
    onSave(editedAd);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <AdCardHeader
          index={index}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={handleSaveClick}
          onCancel={onCancel}
          onCopy={onCopy}
        />

        <div className="grid md:grid-cols-2 gap-4 p-4">
          <AdPreviewSection
            ad={isEditing ? editedAd : ad}
            companyName={companyName}
            isGeneratingImage={isGeneratingImage}
            index={index}
            loadingImageIndex={loadingImageIndex}
            onGenerateImage={onGenerateImage}
            onUpdateAd={onUpdate}
          />
          
          <AdEditorSection
            ad={isEditing ? editedAd : ad}
            isEditing={isEditing}
            onUpdate={handleUpdate}
            onSelectTrigger={handleSelectTrigger}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaAdCard;
