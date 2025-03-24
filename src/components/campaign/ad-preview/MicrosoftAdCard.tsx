
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { MicrosoftAdCardHeader } from "./microsoft";
import { MicrosoftAdPreview } from "./microsoft";
import { MicrosoftAdDetails } from "./microsoft";
import { MicrosoftAdOptimizationAlert } from "./microsoft";

interface MicrosoftAdCardProps {
  ad: GoogleAd;
  index: number;
  analysisResult: WebsiteAnalysisResult;
  onUpdate: (updatedAd: GoogleAd) => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({ 
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
      onUpdate(editedAd);
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
      <MicrosoftAdCardHeader 
        adIndex={index}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      
      {index === 0 && <MicrosoftAdOptimizationAlert />}
      
      <div className="md:flex md:gap-6 items-start">
        <div className="md:w-1/2 mb-4 md:mb-0">
          <MicrosoftAdPreview ad={displayAd} domain={domain} />
        </div>
        
        <div className="md:w-1/2">
          <MicrosoftAdDetails 
            ad={displayAd}
            isEditing={isEditing}
            onHeadlineChange={handleHeadlineChange}
            onDescriptionChange={handleDescriptionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MicrosoftAdCard;
