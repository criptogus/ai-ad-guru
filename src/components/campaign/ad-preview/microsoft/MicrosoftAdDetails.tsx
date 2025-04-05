
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { normalizeGoogleAd } from "@/lib/utils";

export interface MicrosoftAdDetailsProps {
  ad: GoogleAd;
  isEditing?: boolean;
  onUpdate: (updatedAd: GoogleAd) => void;
}

const MicrosoftAdDetails: React.FC<MicrosoftAdDetailsProps> = ({
  ad,
  isEditing = true,
  onUpdate
}) => {
  // Normalize the ad to ensure arrays are present
  const normalizedAd = normalizeGoogleAd(ad);
  
  // Create state from the normalized ad
  const [editedAd, setEditedAd] = useState<GoogleAd>(normalizedAd);

  const handleHeadlineChange = (headlineIndex: number, value: string) => {
    const newHeadlines = [...editedAd.headlines];
    newHeadlines[headlineIndex] = value;
    
    const updatedAd = { ...editedAd, headlines: newHeadlines };
    
    // Also update individual headline properties for compatibility
    if (headlineIndex === 0) updatedAd.headline1 = value;
    if (headlineIndex === 1) updatedAd.headline2 = value;
    if (headlineIndex === 2) updatedAd.headline3 = value;
    
    setEditedAd(updatedAd);
    onUpdate(updatedAd);
  };

  const handleDescriptionChange = (descIndex: number, value: string) => {
    const newDescriptions = [...editedAd.descriptions];
    newDescriptions[descIndex] = value;
    
    const updatedAd = { ...editedAd, descriptions: newDescriptions };
    
    // Also update individual description properties for compatibility
    if (descIndex === 0) updatedAd.description1 = value;
    if (descIndex === 1) updatedAd.description2 = value;
    
    setEditedAd(updatedAd);
    onUpdate(updatedAd);
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Headlines (30 char limit)</h3>
          {editedAd.headlines.map((headline, index) => (
            <div key={`headline-${index}`} className="space-y-1">
              <Label htmlFor={`headline-${index}`} className="text-xs text-muted-foreground">
                Headline {index + 1}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={`headline-${index}`}
                  value={headline}
                  onChange={(e) => handleHeadlineChange(index, e.target.value)}
                  className="text-sm"
                  maxLength={30}
                  readOnly={!isEditing}
                />
                <div className="text-xs text-muted-foreground w-16 text-right">
                  {headline.length}/30
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Descriptions (90 char limit)</h3>
          {editedAd.descriptions.map((description, index) => (
            <div key={`desc-${index}`} className="space-y-1">
              <Label htmlFor={`desc-${index}`} className="text-xs text-muted-foreground">
                Description {index + 1}
              </Label>
              <div className="flex items-start gap-2">
                <Textarea
                  id={`desc-${index}`}
                  value={description}
                  onChange={(e) => handleDescriptionChange(index, e.target.value)}
                  className="text-sm min-h-[80px] resize-none"
                  maxLength={90}
                  readOnly={!isEditing}
                />
                <div className="text-xs text-muted-foreground w-16 text-right">
                  {description.length}/90
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdDetails;
