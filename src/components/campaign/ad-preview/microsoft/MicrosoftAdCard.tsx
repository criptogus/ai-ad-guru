
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { Edit, Check, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import MicrosoftAdDetails from "./MicrosoftAdDetails";
import MicrosoftAdPreview from "./MicrosoftAdPreview";
import { normalizeGoogleAd } from "@/lib/utils";

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
  const [editedAd, setEditedAd] = useState<GoogleAd>(normalizeGoogleAd(ad));

  const handleEditClick = () => {
    setEditedAd(normalizeGoogleAd(ad));
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    onUpdate(normalizeGoogleAd(editedAd));
    setIsEditing(false);
  };

  const handleCopyContent = () => {
    const headlinesText = ad.headlines.join('\n');
    const descriptionsText = ad.descriptions.join('\n');
    
    navigator.clipboard.writeText(
      `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`
    );
  };

  const handleUpdateAd = (updatedAd: GoogleAd) => {
    setEditedAd(normalizeGoogleAd(updatedAd));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-medium">Microsoft Ad {index + 1}</h3>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEdit}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyContent}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <MicrosoftAdPreview 
            ad={isEditing ? editedAd : ad} 
            domain={domain} 
          />
        </div>
        
        {isEditing && (
          <MicrosoftAdDetails
            ad={editedAd}
            onUpdate={handleUpdateAd}
            isEditing={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;
