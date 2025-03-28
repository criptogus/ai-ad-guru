
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import MicrosoftAdPreview from "./MicrosoftAdPreview";
import MicrosoftAdCardHeader from "./MicrosoftAdCardHeader";
import MicrosoftAdDetails from "./MicrosoftAdDetails";

interface MicrosoftAdCardProps {
  ad: GoogleAd;
  domain: string;
  index: number;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({ 
  ad, 
  domain,
  index,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate) {
      onUpdate(editedAd);
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
    setEditedAd({...ad});
  };
  const handleCopy = () => {
    const textToCopy = `Headlines: ${ad.headlines?.join(', ')}\nDescriptions: ${ad.descriptions?.join(', ')}`;
    navigator.clipboard.writeText(textToCopy);
  };

  const [editedAd, setEditedAd] = useState<GoogleAd>({...ad});

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...editedAd.headlines!];
    newHeadlines[index] = value;
    setEditedAd({ ...editedAd, headlines: newHeadlines });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...editedAd.descriptions!];
    newDescriptions[index] = value;
    setEditedAd({ ...editedAd, descriptions: newDescriptions });
  };

  return (
    <Card className="overflow-hidden">
      <MicrosoftAdCardHeader 
        adIndex={index} 
        isEditing={isEditing}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onCopy={handleCopy}
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
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
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;
