
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
  // Ensure the ad object has headlines and descriptions arrays
  const normalizedAd = normalizeGoogleAd(ad);
  const [editedAd, setEditedAd] = useState<GoogleAd>(normalizedAd);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdateAd(editedAd);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAd(normalizedAd);
    setIsEditing(false);
  };

  const handleCopy = () => {
    // Create fallback for copying if headlines/descriptions arrays don't exist
    let headlinesText;
    if (Array.isArray(normalizedAd.headlines)) {
      headlinesText = normalizedAd.headlines.join('\n');
    } else {
      headlinesText = `${normalizedAd.headline1}\n${normalizedAd.headline2}\n${normalizedAd.headline3}`;
    }
      
    let descriptionsText;
    if (Array.isArray(normalizedAd.descriptions)) {
      descriptionsText = normalizedAd.descriptions.join('\n');
    } else {
      descriptionsText = `${normalizedAd.description1}\n${normalizedAd.description2}`;
    }
      
    const content = `Headlines:\n${headlinesText}\n\nDescriptions:\n${descriptionsText}`;
    navigator.clipboard.writeText(content);
  };

  // For simple preview using AdVariationCard
  if (false) { // We'll keep the detailed implementation for now
    return (
      <AdVariationCard
        platform="google"
        ad={{...normalizedAd, finalUrl: domain}}
        onEdit={handleEdit}
        onCopy={handleCopy}
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

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
            ad={isEditing ? editedAd : normalizedAd} 
            domain={domain} 
          />
          <GoogleAdEditor 
            ad={isEditing ? editedAd : normalizedAd} 
            index={index} 
            onUpdateAd={(_, updatedAd) => setEditedAd(normalizeGoogleAd(updatedAd))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleAdCard;
