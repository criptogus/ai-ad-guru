
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { GoogleAd } from "@/hooks/adGeneration";
import TriggerButtonInline from "@/components/campaign/ad-preview/TriggerButtonInline";

interface MicrosoftAdDetailsProps {
  ad: GoogleAd;
  isEditing: boolean;
  onUpdate?: (updatedAd: GoogleAd) => void;
}

const MicrosoftAdDetails: React.FC<MicrosoftAdDetailsProps> = ({
  ad,
  isEditing,
  onUpdate
}) => {
  const [editedAd, setEditedAd] = useState<GoogleAd>({ ...ad });

  const handleHeadlineChange = (index: number, value: string) => {
    if (!isEditing || !onUpdate) return;
    
    const newHeadlines = [...(editedAd.headlines || [])];
    newHeadlines[index] = value;
    
    const updatedAd = { ...editedAd, headlines: newHeadlines };
    setEditedAd(updatedAd);
    onUpdate(updatedAd);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    if (!isEditing || !onUpdate) return;
    
    const newDescriptions = [...(editedAd.descriptions || [])];
    newDescriptions[index] = value;
    
    const updatedAd = { ...editedAd, descriptions: newDescriptions };
    setEditedAd(updatedAd);
    onUpdate(updatedAd);
  };

  const insertTrigger = (text: string, fieldType: 'headline' | 'description', index: number) => {
    if (!isEditing || !onUpdate) return;
    
    if (fieldType === 'headline') {
      const newHeadlines = [...(editedAd.headlines || [])];
      newHeadlines[index] = `${newHeadlines[index] || ''} ${text}`.trim();
      
      const updatedAd = { ...editedAd, headlines: newHeadlines };
      setEditedAd(updatedAd);
      onUpdate(updatedAd);
    } else {
      const newDescriptions = [...(editedAd.descriptions || [])];
      newDescriptions[index] = `${newDescriptions[index] || ''} ${text}`.trim();
      
      const updatedAd = { ...editedAd, descriptions: newDescriptions };
      setEditedAd(updatedAd);
      onUpdate(updatedAd);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Headlines (30 chars max)</h4>
        {isEditing ? (
          (editedAd.headlines || []).map((headline, index) => (
            <div key={`headline-${index}`} className="relative">
              <Input
                value={headline || ''}
                onChange={(e) => handleHeadlineChange(index, e.target.value)}
                maxLength={30}
                placeholder={`Headline ${index + 1}`}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">
                  {(headline || '').length}/30
                </span>
                <TriggerButtonInline
                  onInsert={(text) => insertTrigger(text, 'headline', index)}
                />
              </div>
            </div>
          ))
        ) : (
          (ad.headlines || []).map((headline, index) => (
            <div key={`headline-${index}`} className="border p-2 rounded-md">
              {headline || `Headline ${index + 1} (empty)`}
            </div>
          ))
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Descriptions (90 chars max)</h4>
        {isEditing ? (
          (editedAd.descriptions || []).map((description, index) => (
            <div key={`description-${index}`} className="relative">
              <Textarea
                value={description || ''}
                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                maxLength={90}
                placeholder={`Description ${index + 1}`}
                className="min-h-[80px] pr-20"
              />
              <div className="absolute right-2 top-2 flex items-center space-x-1">
                <span className="text-xs text-muted-foreground">
                  {(description || '').length}/90
                </span>
                <TriggerButtonInline
                  onInsert={(text) => insertTrigger(text, 'description', index)}
                />
              </div>
            </div>
          ))
        ) : (
          (ad.descriptions || []).map((description, index) => (
            <div key={`description-${index}`} className="border p-2 rounded-md">
              {description || `Description ${index + 1} (empty)`}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MicrosoftAdDetails;
