
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAd } from "@/hooks/adGeneration";

interface MicrosoftAdDetailsProps {
  ad: GoogleAd;
  isEditing: boolean;
  onHeadlineChange: (value: string, index: number) => void;
  onDescriptionChange: (value: string, index: number) => void;
}

const MicrosoftAdDetails: React.FC<MicrosoftAdDetailsProps> = ({
  ad,
  isEditing,
  onHeadlineChange,
  onDescriptionChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-medium mb-2">Headlines</h4>
        <div className="space-y-3">
          {ad.headlines.map((headline, index) => (
            <div key={index}>
              <Label htmlFor={`headline-${index}`} className="text-xs font-normal text-gray-500 mb-1">
                Headline {index + 1} ({headline.length}/30 characters)
              </Label>
              {isEditing ? (
                <Input
                  id={`headline-${index}`}
                  value={headline}
                  onChange={(e) => onHeadlineChange(e.target.value, index)}
                  maxLength={30}
                  className="mt-1"
                />
              ) : (
                <div className="border p-2 rounded-md text-sm">
                  {headline}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Descriptions</h4>
        <div className="space-y-3">
          {ad.descriptions.map((description, index) => (
            <div key={index}>
              <Label htmlFor={`description-${index}`} className="text-xs font-normal text-gray-500 mb-1">
                Description {index + 1} ({description.length}/90 characters)
              </Label>
              {isEditing ? (
                <Input
                  id={`description-${index}`}
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value, index)}
                  maxLength={90}
                  className="mt-1"
                />
              ) : (
                <div className="border p-2 rounded-md text-sm">
                  {description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {isEditing && (
        <div className="text-xs text-gray-500 mt-4">
          <p>Microsoft Ad Character Limits:</p>
          <ul className="list-disc list-inside">
            <li>Headlines: 30 characters each</li>
            <li>Descriptions: 90 characters each</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MicrosoftAdDetails;
