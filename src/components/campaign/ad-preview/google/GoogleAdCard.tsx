import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { Button } from "@/components/ui/button";
import { Copy, Edit, Save, X } from "lucide-react";
import GoogleAdPreview from "./GoogleAdPreview";
import GoogleAdEditor from "./GoogleAdEditor";
import AdVariationCard from "../AdVariationCard";
import { normalizeGoogleAd } from "@/lib/utils";

interface GoogleAdCardProps {
  ad: GoogleAd;
  index: number;
  domain: string;
  onUpdateAd: (updatedAd: GoogleAd) => void;
}

const GoogleAdCard: React.FC<GoogleAdCardProps> = ({
  ad,
  index,
  domain,
  onUpdateAd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  // Always normalize the ad to ensure headlines and descriptions arrays exist
  const normalizedAd = normalizeGoogleAd(ad);
  const [editedAd, setEditedAd] = useState<GoogleAd>(normalizedAd);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Always normalize the ad before saving
    onUpdateAd(normalizeGoogleAd(editedAd));
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to the original normalized ad
    setEditedAd(normalizedAd);
    setIsEditing(false);
  };

  const handleCopy = () => {
    // Create fallback for copying if headlines/descriptions arrays don't exist
    const headlinesText = normalizedAd.headlines.join('\n');
    const descriptionsText = normalizedAd.descriptions.join('\n');
    const content = `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`;
    navigator.clipboard.writeText(content);
  };

  return (
    <Card>
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex justify-between items-center bg-muted p-3 border-b">
          <h3 className="text-sm font-medium">Google Ad #{index + 1}</h3>
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
        <div className="grid md:grid-cols-2 gap-4 p-4">
          <GoogleAdPreview 
            ad={isEditing ? normalizeGoogleAd(editedAd) : normalizedAd} 
            domain={domain} 
          />
          <GoogleAdEditor 
            ad={isEditing ? normalizeGoogleAd(editedAd) : normalizedAd} 
            index={index} 
            onUpdateAd={(idx, updatedAd) => setEditedAd(normalizeGoogleAd(updatedAd))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;
