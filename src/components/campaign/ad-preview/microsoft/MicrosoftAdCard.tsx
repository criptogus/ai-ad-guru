
import React, { useState } from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MicrosoftAdPreview } from "@/components/campaign/ad-preview/microsoft";
import MicrosoftAdCardHeader from "./MicrosoftAdCardHeader";
import TriggerButtonInline from "@/components/campaign/ad-preview/TriggerButtonInline";

interface MicrosoftAdCardProps {
  index: number;
  ad: GoogleAd;
  domain: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedAd: GoogleAd) => void;
  onCancel: () => void;
  onCopy: () => void;
}

const MicrosoftAdCard: React.FC<MicrosoftAdCardProps> = ({
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

  const insertTrigger = (text: string, fieldType: 'headline' | 'description', index: number) => {
    if (fieldType === 'headline') {
      const newHeadlines = [...editedAd.headlines];
      newHeadlines[index] = `${newHeadlines[index]} ${text}`.trim();
      setEditedAd({ ...editedAd, headlines: newHeadlines });
    } else {
      const newDescriptions = [...editedAd.descriptions];
      newDescriptions[index] = `${newDescriptions[index]} ${text}`.trim();
      setEditedAd({ ...editedAd, descriptions: newDescriptions });
    }
  };

  return (
    <Card className="overflow-hidden">
      <MicrosoftAdCardHeader
        adIndex={index}
        isEditing={isEditing}
        onEdit={onEdit}
        onSave={() => onSave(editedAd)}
        onCancel={onCancel}
        onCopy={onCopy}
      />
      <CardContent className="pb-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Headlines (30 chars max)</h4>
              {editedAd.headlines.map((headline, hIndex) => (
                <div key={`headline-${hIndex}`} className="relative">
                  <Input
                    value={headline}
                    onChange={(e) => handleHeadlineChange(hIndex, e.target.value)}
                    maxLength={30}
                    placeholder={`Headline ${hIndex + 1}`}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">
                      {headline.length}/30
                    </span>
                    <TriggerButtonInline
                      onInsert={(text) => insertTrigger(text, 'headline', hIndex)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Descriptions (90 chars max)</h4>
              {editedAd.descriptions.map((description, dIndex) => (
                <div key={`description-${dIndex}`} className="relative">
                  <Textarea
                    value={description}
                    onChange={(e) => handleDescriptionChange(dIndex, e.target.value)}
                    maxLength={90}
                    placeholder={`Description ${dIndex + 1}`}
                    className="min-h-[80px] pr-20"
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">
                      {description.length}/90
                    </span>
                    <TriggerButtonInline
                      onInsert={(text) => insertTrigger(text, 'description', dIndex)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <MicrosoftAdPreview ad={ad} domain={domain} />
        )}
      </CardContent>
    </Card>
  );
};

export default MicrosoftAdCard;
