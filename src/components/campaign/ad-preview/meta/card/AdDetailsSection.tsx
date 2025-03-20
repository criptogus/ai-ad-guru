
import React from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import AdMetaData from "./AdMetaData";

interface AdDetailsSectionProps {
  ad: MetaAd;
  onUpdate: (updatedAd: MetaAd) => void;
  isEditing?: boolean;
}

const AdDetailsSection: React.FC<AdDetailsSectionProps> = ({ 
  ad, 
  onUpdate,
  isEditing = false 
}) => {
  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...ad,
      headline: e.target.value
    });
  };

  const handlePrimaryTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...ad,
      primaryText: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...ad,
      description: e.target.value
    });
  };

  const handleImagePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...ad,
      imagePrompt: e.target.value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`headline-${ad.headline}`}>Headline</Label>
        {isEditing ? (
          <Input 
            id={`headline-${ad.headline}`}
            value={ad.headline}
            onChange={handleHeadlineChange}
            maxLength={150}
            placeholder="Enter ad headline"
          />
        ) : (
          <div className="p-2 bg-gray-50 rounded border text-sm">
            {ad.headline}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`primaryText-${ad.headline}`}>Primary Text</Label>
        {isEditing ? (
          <Textarea 
            id={`primaryText-${ad.headline}`}
            value={ad.primaryText}
            onChange={handlePrimaryTextChange}
            maxLength={600}
            placeholder="Enter primary ad text"
            rows={4}
          />
        ) : (
          <div className="p-2 bg-gray-50 rounded border text-sm">
            {ad.primaryText}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`description-${ad.headline}`}>Description/CTA</Label>
        {isEditing ? (
          <Input 
            id={`description-${ad.headline}`}
            value={ad.description}
            onChange={handleDescriptionChange}
            maxLength={150}
            placeholder="Enter ad description/CTA"
          />
        ) : (
          <div className="p-2 bg-gray-50 rounded border text-sm">
            {ad.description}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`imagePrompt-${ad.headline}`}>Image Prompt</Label>
        {isEditing ? (
          <Textarea 
            id={`imagePrompt-${ad.headline}`}
            value={ad.imagePrompt}
            onChange={handleImagePromptChange}
            placeholder="Enter image generation prompt"
            rows={3}
          />
        ) : (
          <div className="p-2 bg-gray-50 rounded border text-sm">
            {ad.imagePrompt}
          </div>
        )}
      </div>
      
      <AdMetaData />
    </div>
  );
};

export default AdDetailsSection;
