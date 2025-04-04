
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Card, CardContent } from "@/components/ui/card";
import LinkedInAdCardHeader from "./LinkedInAdCardHeader";
import LinkedInAdDetails from "./LinkedInAdDetails";
import LinkedInAdPreview from "./LinkedInAdPreview";
import { useEditableAd } from "./hooks/useEditableAd";

interface LinkedInAdCardProps {
  ad: MetaAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  isGeneratingImage: boolean;
  isEditing?: boolean;
  onGenerateImage: () => Promise<void>;
  onUpdateAd?: (updatedAd: MetaAd) => void;
  onEdit?: () => void;
  onSave?: (updatedAd: MetaAd) => void;
  onCancel?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  previewType?: "feed" | "message" | "sidebar" | "spotlight";
}

const LinkedInAdCard: React.FC<LinkedInAdCardProps> = ({
  ad,
  index,
  analysisResult,
  isGeneratingImage,
  isEditing: externalIsEditing,
  onGenerateImage,
  onUpdateAd,
  onEdit,
  onSave,
  onCancel,
  onCopy,
  onDelete,
  previewType = "feed"
}) => {
  const {
    isEditing,
    editedAd,
    handleCopy,
    handleEditToggle,
    handleSave,
    handleCancel,
    handleChange
  } = useEditableAd({
    ad,
    externalIsEditing,
    onUpdateAd,
    onEdit,
    onSave,
    onCancel,
    onCopy,
    index
  });

  return (
    <Card>
      <LinkedInAdCardHeader 
        adIndex={index}
        isEditing={isEditing}
        onEdit={handleEditToggle}
        onSave={handleSave}
        onCancel={handleCancel}
        onCopy={handleCopy}
        onDelete={onDelete}
      />
      <CardContent className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <LinkedInAdPreview 
              ad={isEditing ? editedAd : ad}
              analysisResult={analysisResult}
              isGeneratingImage={isGeneratingImage}
              onGenerateImage={onGenerateImage}
              onUpdateAd={onUpdateAd}
              previewType={previewType}
            />
          </div>
          
          <LinkedInAdDetails 
            ad={editedAd}
            isEditing={isEditing}
            onHeadlineChange={(value) => handleChange('headline', value)}
            onPrimaryTextChange={(value) => handleChange('primaryText', value)}
            onDescriptionChange={(value) => handleChange('description', value)}
            onImagePromptChange={(value) => handleChange('imagePrompt', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdCard;
