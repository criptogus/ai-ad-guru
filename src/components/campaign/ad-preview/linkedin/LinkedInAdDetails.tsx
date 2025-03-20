
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MetaAd } from "@/hooks/adGeneration";

interface LinkedInAdDetailsProps {
  ad: MetaAd;
  isEditing: boolean;
  onHeadlineChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPrimaryTextChange: (value: string) => void;
  onImagePromptChange?: (value: string) => void;
}

const LinkedInAdDetails: React.FC<LinkedInAdDetailsProps> = ({
  ad,
  isEditing,
  onHeadlineChange,
  onDescriptionChange,
  onPrimaryTextChange,
  onImagePromptChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-medium mb-2">Primary Text</h4>
        {isEditing ? (
          <div>
            <Label htmlFor="primaryText" className="text-xs font-normal text-gray-500 mb-1">
              Text above the image ({ad.primaryText.length}/600 characters)
            </Label>
            <Textarea
              id="primaryText"
              value={ad.primaryText}
              onChange={(e) => onPrimaryTextChange(e.target.value)}
              maxLength={600}
              rows={3}
              className="mt-1"
            />
          </div>
        ) : (
          <div className="border p-3 rounded-md text-sm">
            {ad.primaryText}
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Headline</h4>
        {isEditing ? (
          <div>
            <Label htmlFor="headline" className="text-xs font-normal text-gray-500 mb-1">
              Main headline ({ad.headline.length}/150 characters)
            </Label>
            <Input
              id="headline"
              value={ad.headline}
              onChange={(e) => onHeadlineChange(e.target.value)}
              maxLength={150}
              className="mt-1"
            />
          </div>
        ) : (
          <div className="border p-3 rounded-md text-sm">
            {ad.headline}
          </div>
        )}
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Call to Action</h4>
        {isEditing ? (
          <div>
            <Label htmlFor="description" className="text-xs font-normal text-gray-500 mb-1">
              Button text / Call to action ({ad.description.length}/50 characters)
            </Label>
            <Input
              id="description"
              value={ad.description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              maxLength={50}
              className="mt-1"
            />
          </div>
        ) : (
          <div className="border p-3 rounded-md text-sm">
            {ad.description}
          </div>
        )}
      </div>
      
      {/* Add Image Prompt field that's always editable */}
      <div>
        <h4 className="text-md font-medium mb-2">Image Prompt</h4>
        {isEditing && onImagePromptChange ? (
          <div>
            <Label htmlFor="imagePrompt" className="text-xs font-normal text-gray-500 mb-1">
              Description for AI image generation
            </Label>
            <Textarea
              id="imagePrompt"
              value={ad.imagePrompt || ""}
              onChange={(e) => onImagePromptChange(e.target.value)}
              rows={3}
              className="mt-1"
            />
          </div>
        ) : (
          <div className="border p-3 rounded-md text-sm bg-gray-50">
            {ad.imagePrompt || "No image prompt provided"}
          </div>
        )}
      </div>
      
      {isEditing && (
        <div className="text-xs text-gray-500 mt-4">
          <p>LinkedIn Ad Character Limits:</p>
          <ul className="list-disc list-inside">
            <li>Headline: 150 characters</li>
            <li>Description/Call to Action: 50 characters</li>
            <li>Primary Text: 600 characters</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LinkedInAdDetails;
