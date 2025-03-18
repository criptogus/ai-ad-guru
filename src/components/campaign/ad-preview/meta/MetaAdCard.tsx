
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import MetaAdCardHeader from "./MetaAdCardHeader";
import InstagramPreview from "./InstagramPreview";
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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);
  const [imageKey, setImageKey] = useState(Date.now()); // Force image refresh when URL changes
  const [imageGenerationAttempts, setImageGenerationAttempts] = useState(0);

  // Update imageKey when imageUrl changes to force a re-render
  useEffect(() => {
    if (ad.imageUrl) {
      setImageKey(Date.now());
      console.log("Image URL updated:", ad.imageUrl);
    }
  }, [ad.imageUrl]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The text has been copied to your clipboard",
      duration: 2000,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(index, editedAd);
    }
    toast({
      title: "Ad Updated",
      description: "Your changes have been saved",
      duration: 2000,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAd(ad);
  };

  const handleInputChange = (field: keyof MetaAd, value: string) => {
    setEditedAd({ ...editedAd, [field]: value });
  };

  const handleGenerateImage = async () => {
    try {
      setImageGenerationAttempts(prev => prev + 1);
      await onGenerateImage(ad, index);
    } catch (error) {
      console.error("Error handling image generation:", error);
      toast({
        title: "Image Generation Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCopy = () => {
    const adText = `${ad.headline}\n\n${ad.primaryText}\n\n${ad.description}`;
    copyToClipboard(adText);
  };

  const displayAd = isEditing ? editedAd : ad;

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm mb-4">
      <MetaAdCardHeader 
        index={index} 
        isEditing={isEditing}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      
      <InstagramPreview 
        ad={displayAd}
        companyName={analysisResult.companyName}
        imageKey={imageKey}
        loadingImageIndex={loadingImageIndex}
        index={index}
        onGenerateImage={handleGenerateImage}
      />
      
      <AdDetailsSection 
        displayAd={displayAd}
        isEditing={isEditing}
        editedAd={editedAd}
        onInputChange={handleInputChange}
        onGenerateImage={handleGenerateImage}
        loadingImageIndex={loadingImageIndex}
      />
    </div>
  );
};

export default MetaAdCard;
