import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import LinkedInAdCardHeader from "./LinkedInAdCardHeader";
import LinkedInAdPreview from "./LinkedInAdPreview";
import LinkedInAdDetails from "./LinkedInAdDetails";
import LinkedInAdOptimizationAlert from "./LinkedInAdOptimizationAlert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [isUploading, setIsUploading] = useState(false);

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
  
  const handleUploadImage = async (file: File): Promise<void> => {
    try {
      setIsUploading(true);
      
      // Check file validity
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        throw new Error("Please upload a valid image file (JPG or PNG)");
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB");
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-linkedin-ad-${index}.${fileExt}`;
      const filePath = `linkedin-ads/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('ad-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('ad-images')
        .getPublicUrl(filePath);
      
      // Update the ad with the new image URL
      const updatedAd = {
        ...editedAd,
        imageUrl: publicUrl
      };
      
      // If in editing mode, update the local state
      if (isEditing) {
        setEditedAd(updatedAd);
      }
      
      // If we have an update callback, call it
      if (onUpdateAd) {
        onUpdateAd(index, updatedAd);
      }
      
      toast.success("Image uploaded successfully", {
        description: "Your LinkedIn ad has been updated with the new image.",
      });
      
      // Remove the return statement to ensure Promise<void>
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", {
        description: error instanceof Error ? error.message : "Please try again or use AI image generation instead.",
      });
    } finally {
      setIsUploading(false);
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
              isGeneratingImage={isGeneratingImage || isUploading}
              onGenerateImage={onGenerateImage}
              onUploadImage={handleUploadImage}
            />
          </div>
          
          {/* Ad Details - Column 3-5 */}
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
