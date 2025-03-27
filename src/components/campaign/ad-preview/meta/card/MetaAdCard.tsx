
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { MetaAdCardProps } from "./types";
import AdCardHeader from "./AdCardHeader";
import AdPreviewSection from "./AdPreviewSection";
import AdEditorSection from "./AdEditorSection";
import AdVariationCard from "../../AdVariationCard";

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
  onUpdate,
  onDuplicate,
  onDelete
}) => {
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);
  const [viewMode, setViewMode] = useState<"feed" | "story" | "reel">("feed");
  const companyName = analysisResult?.companyName || "Your Company";

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

  // For simple preview using AdVariationCard
  if (false) { // We'll keep the detailed implementation for now
    return (
      <AdVariationCard
        platform="meta"
        ad={{...ad, companyName}}
        onEdit={onEdit}
        onRegenerate={onGenerateImage}
        onDelete={onDelete}
        onCopy={onCopy}
        isEditing={isEditing}
        onSave={handleSaveClick}
        onCancel={onCancel}
      />
    );
  }

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
          onDuplicate={onDuplicate}
          onDelete={onDelete}
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
            viewMode={viewMode}
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
