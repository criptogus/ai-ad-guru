
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Save, X } from "lucide-react";
import { MicrosoftAd } from "@/hooks/adGeneration/types";
import { MicrosoftAdPreview } from ".";
import { normalizeGoogleAd } from "@/lib/utils";

export interface MicrosoftAdCardProps {
  ad: MicrosoftAd;
  domain: string;
  index: number;
  onUpdate: (updatedAd: MicrosoftAd) => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({
  ad,
  domain,
  index,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAd, setEditedAd] = useState<MicrosoftAd>(normalizeGoogleAd(ad) as MicrosoftAd);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedAd);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAd(normalizeGoogleAd(ad) as MicrosoftAd);
    setIsEditing(false);
  };

  const handleCopy = () => {
    // Create text representation for copying
    const headlinesText = ad.headlines.join('\n');
    const descriptionsText = ad.descriptions.join('\n');
    const content = `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`;
    
    navigator.clipboard.writeText(content);
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex justify-between items-center bg-muted p-3 border-b">
          <h3 className="text-sm font-medium">Microsoft Ad #{index + 1}</h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Ad Content */}
        <div className="p-4">
          <MicrosoftAdPreview 
            ad={isEditing ? editedAd : ad} 
            domain={domain} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;
