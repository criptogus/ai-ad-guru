
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCardHeader from "./LinkedInAdCardHeader";
import LinkedInAdPreview from "./LinkedInAdPreview";
import LinkedInAdDetails from "./LinkedInAdDetails";
import LinkedInAdOptimizationAlert from "./LinkedInAdOptimizationAlert";
import { toast } from "sonner";

interface LinkedInAdCardProps {
  ad: MetaAd;
  index: number;
  isGeneratingImage?: boolean;
  analysisResult: WebsiteAnalysisResult;
  onGenerateImage?: () => Promise<void>;
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

  const handleImagePromptChange = (value: string) => {
    setEditedAd(prev => ({
      ...prev,
      imagePrompt: value
    }));
  };
  
  const handleUploadImage = async (file: File) => {
    // This function would typically upload the file to your storage service
    // and then update the ad with the new image URL
    // For now we'll use a simple mock implementation
    
    try {
      // Show loading toast
      toast.loading("Uploading image...");
      
      // Create a temporary URL for the file
      const imageUrl = URL.createObjectURL(file);
      
      // Update the ad with the new image URL
      const updatedAd = {
        ...editedAd,
        imageUrl
      };
      
      // If in editing mode, update the local state
      if (isEditing) {
        setEditedAd(updatedAd);
      }
      
      // If we have an update callback, call it
      if (onUpdateAd) {
        onUpdateAd(index, updatedAd);
      }
      
      // Show success toast
      toast.success("Image uploaded successfully", {
        description: "Your LinkedIn ad has been updated with the new image.",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: "Please try again or use AI image generation instead.",
      });
    }
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
              onUploadImage={handleUploadImage}
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
              onImagePromptChange={handleImagePromptChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAdCard;
