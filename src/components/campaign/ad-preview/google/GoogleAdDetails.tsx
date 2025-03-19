
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoogleAd } from "@/hooks/adGeneration";

interface GoogleAdDetailsProps {
  ad: GoogleAd;
  isEditing: boolean;
  onHeadlineChange: (value: string, index: number) => void;
  onDescriptionChange: (value: string, index: number) => void;
}

const GoogleAdDetails: React.FC<GoogleAdDetailsProps> = ({
  ad,
  isEditing,
  onHeadlineChange,
  onDescriptionChange,
}) => {
  return (
    <div className="mt-4 p-3 bg-[#F1F0FB] border border-[#aaadb0] rounded-md shadow-sm text-sm">
      <div className="mb-3">
        <span className="font-medium text-gray-700 block mb-2">Headlines:</span>
        <div className="space-y-1.5">
          {ad.headlines.map((headline, i) => (
            <div key={i} className="flex flex-col">
              {isEditing ? (
                <div>
                  <Input 
                    value={headline}
                    onChange={(e) => onHeadlineChange(e.target.value, i)}
                    className="text-sm h-8"
                    maxLength={30}
                    placeholder={`Headline ${i+1}`}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {headline.length}/30 characters
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[#403E43]">{i+1}. {headline}</span>
                  <span className="text-xs text-gray-500">{headline.length}/30 characters</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <span className="font-medium text-gray-700 block mb-2">Descriptions:</span>
        <div className="space-y-1.5">
          {ad.descriptions.map((desc, i) => (
            <div key={i} className="flex flex-col">
              {isEditing ? (
                <div>
                  <Textarea 
                    value={desc}
                    onChange={(e) => onDescriptionChange(e.target.value, i)}
                    className="text-sm min-h-[60px]"
                    maxLength={90}
                    placeholder={`Description ${i+1}`}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {desc.length}/90 characters
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-[#403E43]">{i+1}. {desc}</span>
                  <span className="text-xs text-gray-500">{desc.length}/90 characters</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoogleAdDetails;
