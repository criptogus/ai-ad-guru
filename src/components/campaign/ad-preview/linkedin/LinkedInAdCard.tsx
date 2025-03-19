
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCardHeader from "./LinkedInAdCardHeader";
import LinkedInAdPreview from "./LinkedInAdPreview";
import LinkedInAdDetails from "./LinkedInAdDetails";
import LinkedInAdOptimizationAlert from "./LinkedInAdOptimizationAlert";

interface LinkedInAdCardProps {
  ad: MetaAd;
  index: number;
  isGeneratingImage?: boolean;
  analysisResult: WebsiteAnalysisResult;
  onGenerateImage?: () => void;
  onUpdateAd?: (index: number, updatedAd: MetaAd) => void;
}

const LinkedInAdCard: React.FC<LinkedInAdCardProps> = ({
  ad,
  index,
  isGeneratingImage = false,
  analysisResult,
  onGenerateImage,
  onUpdateAd
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<MetaAd>({ ...ad });

  const handleEdit = () => {
    setEditedAd({ ...ad });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    if (onUpdateAd) {
      onUpdateAd(index, editedAd);
    }
    setIsEditing(false);
  };

  const handleHeadlineChange = (value: string) => {
    setEditedAd(prev => ({
      ...prev,
      headline: value
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setEditedAd(prev => ({
      ...prev,
      description: value
    }));
  };

  const handlePrimaryTextChange = (value: string) => {
    setEditedAd(prev => ({
      ...prev,
      primaryText: value
    }));
  };

  return (
    <Card>
      <LinkedInAdCardHeader 
        adIndex={index} 
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <CardContent className="p-4 space-y-4">
        <LinkedInAdOptimizationAlert />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LinkedIn Ad Preview - Column 1-2 */}
          <div className="lg:col-span-2">
            <LinkedInAdPreview 
              ad={isEditing ? editedAd : ad} 
              analysisResult={analysisResult}
              isGeneratingImage={isGeneratingImage}
              onGenerateImage={onGenerateImage}
            />
          </div>
          
          {/* LinkedIn Ad Details - Column 3-5 */}
          <div className="lg:col-span-3">
            <LinkedInAdDetails 
              ad={isEditing ? editedAd : ad}
              isEditing={isEditing}
              onHeadlineChange={handleHeadlineChange}
              onDescriptionChange={handleDescriptionChange}
              onPrimaryTextChange={handlePrimaryTextChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdCard;
