
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import MicrosoftAdCardHeader from "./MicrosoftAdCardHeader";
import MicrosoftAdDetails from "./MicrosoftAdDetails";
import MicrosoftAdPreview from "./MicrosoftAdPreview";

interface MicrosoftAdCardProps {
  ad: GoogleAd;
  domain: string;
  index: number;
  onUpdate: (updatedAd: GoogleAd) => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({ 
  ad, 
  domain, 
  index, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<GoogleAd>(ad);

  const handleEdit = () => {
    setEditedAd({...ad});
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedAd);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAd({...ad});
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(ad, null, 2));
  };

  const handleHeadlineChange = (index: number, value: string) => {
    const updatedHeadlines = [...editedAd.headlines];
    updatedHeadlines[index] = value;
    setEditedAd({
      ...editedAd,
      headlines: updatedHeadlines
    });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...editedAd.descriptions];
    updatedDescriptions[index] = value;
    setEditedAd({
      ...editedAd,
      descriptions: updatedDescriptions
    });
  };

  return (
    <Card className="mb-4">
      <MicrosoftAdCardHeader 
        adIndex={index}
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onCopy={handleCopy}
      />
      <CardContent className="p-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <MicrosoftAdPreview 
              ad={isEditing ? editedAd : ad} 
              domain={domain} 
            />
          </div>
          <div>
            <MicrosoftAdDetails 
              ad={ad}
              isEditing={isEditing}
              editedAd={editedAd}
              onHeadlineChange={handleHeadlineChange}
              onDescriptionChange={handleDescriptionChange}
              onUpdate={onUpdate}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;
