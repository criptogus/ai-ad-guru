
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import {
  GoogleAdCardHeader,
  GoogleAdPreview,
  GoogleAdDetails,
  GoogleAdOptimizationAlert,
} from "./google";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate?: (index: number, updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({ 
  ad, 
  index, 
  analysisResult,
  onUpdate 
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<GoogleAd>(ad);

  const domain = analysisResult.websiteUrl 
    ? new URL(analysisResult.websiteUrl).hostname 
    : `www.${analysisResult.companyName.toLowerCase().replace(/\s+/g, "")}.com`;

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

  const handleHeadlineChange = (value: string, headlineIndex: number) => {
    const updatedHeadlines = [...editedAd.headlines];
    updatedHeadlines[headlineIndex] = value;
    setEditedAd({ ...editedAd, headlines: updatedHeadlines });
  };

  const handleDescriptionChange = (value: string, descIndex: number) => {
    const updatedDescriptions = [...editedAd.descriptions];
    updatedDescriptions[descIndex] = value;
    setEditedAd({ ...editedAd, descriptions: updatedDescriptions });
  };

  const handleCopy = () => {
    const adText = `${ad.headlines.join(" | ")}\n\n${ad.descriptions.join("\n")}`;
    copyToClipboard(adText);
  };

  // We use the edited ad when in editing mode, otherwise use the original ad
  const displayAd = isEditing ? editedAd : ad;

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm mb-4">
      <GoogleAdCardHeader 
        index={index}
        isEditing={isEditing}
        onCopy={handleCopy}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      
      {index === 0 && <GoogleAdOptimizationAlert />}
      
      <GoogleAdPreview ad={displayAd} domain={domain} />
      
      <GoogleAdDetails 
        ad={displayAd}
        isEditing={isEditing}
        onHeadlineChange={handleHeadlineChange}
        onDescriptionChange={handleDescriptionChange}
      />
    </div>
  );
};

export default GoogleAdCard;
