
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration";
import GoogleAdPreview from "./GoogleAdPreview";
import GoogleAdCardHeader from "./GoogleAdCardHeader";
import GoogleAdDetails from "./GoogleAdDetails";

interface GoogleAdCardProps {
  index: number;
  ad: GoogleAd;
  domain: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedAd: GoogleAd) => void;
  onCancel: () => void;
  onCopy: () => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({
  index,
  ad,
  domain,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy,
}) => {
  const [editedAd, setEditedAd] = useState<GoogleAd>({ ...ad });

  const handleHeadlineChange = (index: number, value: string) => {
    const newHeadlines = [...editedAd.headlines];
    newHeadlines[index] = value;
    setEditedAd({ ...editedAd, headlines: newHeadlines });
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newDescriptions = [...editedAd.descriptions];
    newDescriptions[index] = value;
    setEditedAd({ ...editedAd, descriptions: newDescriptions });
  };

  const handleSaveClick = () => {
    onSave(editedAd);
  };

  const handleCancelClick = () => {
    setEditedAd({ ...ad });
    onCancel();
  };

  return (
    <Card className="overflow-hidden">
      <GoogleAdCardHeader
        index={index}
        ad={ad}
        isEditing={isEditing}
        onEdit={onEdit}
        onSave={handleSaveClick}
        onCancel={handleCancelClick}
        onCopy={onCopy}
      />
      <CardContent className="p-4 grid gap-4 md:grid-cols-2">
        <div>
          <GoogleAdPreview 
            ad={isEditing ? editedAd : ad} 
            domain={domain} 
          />
        </div>
        <div>
          <GoogleAdDetails 
            ad={editedAd}
            isEditing={isEditing}
            onUpdate={(updatedAd) => setEditedAd(updatedAd)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;
