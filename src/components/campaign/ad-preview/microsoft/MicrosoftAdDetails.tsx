
import React from "react";
import { GoogleAd } from "@/hooks/adGeneration";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TriggerButtonInline from "@/components/campaign/ad-preview/TriggerButtonInline";

interface MicrosoftAdDetailsProps {
  ad: GoogleAd;
  isEditing: boolean;
  editedAd?: GoogleAd;
  onHeadlineChange?: (index: number, value: string) => void;
  onDescriptionChange?: (index: number, value: string) => void;
}

const MicrosoftAdDetails: React.FC<MicrosoftAdDetailsProps> = ({
  ad,
  isEditing,
  editedAd = ad,
  onHeadlineChange,
  onDescriptionChange
}) => {
  // Helper to insert trigger text
  const insertTrigger = (text: string, fieldType: 'headline' | 'description', index: number) => {
    if (fieldType === 'headline' && onHeadlineChange) {
      const currentHeadline = editedAd.headlines?.[index] || '';
      onHeadlineChange(index, `${currentHeadline} ${text}`.trim());
    } else if (fieldType === 'description' && onDescriptionChange) {
      const currentDescription = editedAd.descriptions?.[index] || '';
      onDescriptionChange(index, `${currentDescription} ${text}`.trim());
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Headlines (30 chars max)</h4>
          {editedAd.headlines?.map((headline, hIndex) => (
            <div key={`headline-${hIndex}`} className="relative">
              <Input
                value={headline}
                onChange={(e) => onHeadlineChange && onHeadlineChange(hIndex, e.target.value)}
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
          {editedAd.descriptions?.map((description, dIndex) => (
            <div key={`description-${dIndex}`} className="relative">
              <Textarea
                value={description}
                onChange={(e) => onDescriptionChange && onDescriptionChange(dIndex, e.target.value)}
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
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <h4 className="text-sm font-medium">Headlines</h4>
        <ul className="list-disc pl-5 text-sm">
          {ad.headlines?.map((headline, index) => (
            <li key={index}>{headline}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-sm font-medium">Descriptions</h4>
        <ul className="list-disc pl-5 text-sm">
          {ad.descriptions?.map((description, index) => (
            <li key={index}>{description}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MicrosoftAdDetails;
