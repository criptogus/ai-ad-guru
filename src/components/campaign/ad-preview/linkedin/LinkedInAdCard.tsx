
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
}

const LinkedInAdCard: React.FC<LinkedInAdCardProps> = ({
  ad,
  index,
  analysisResult,
  isGeneratingImage = false,
  onGenerateImage,
  onUpdateAd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [previewType, setPreviewType] = useState<"feed" | "sidebar" | "message">("feed");
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [imageFormat, setImageFormat] = useState<string>("landscape");

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);
  
  const handleCopy = () => {
    const textToCopy = `Headline: ${ad.headline}\nPrimary Text: ${ad.primaryText}\nDescription: ${ad.description}`;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <Card className="overflow-hidden">
      <LinkedInAdCardHeader 
        index={index}
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
          <div className="bg-gray-50 p-4 rounded-md">
            <LinkedInAdPreview 
              ad={ad}
              analysisResult={analysisResult}
              isGeneratingImage={isGeneratingImage}
              onGenerateImage={onGenerateImage}
              imageFormat={imageFormat}
              previewType={previewType}
              deviceView={deviceView}
            />
          </div>
          
          <div>
            <LinkedInAdDetails 
              ad={ad}
              isEditing={isEditing}
              onUpdateAd={onUpdateAd}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdCard;
