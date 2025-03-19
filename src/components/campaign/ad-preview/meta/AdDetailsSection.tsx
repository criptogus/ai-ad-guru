
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MetaAd } from "@/hooks/adGeneration";

interface AdDetailsSectionProps {
  displayAd: MetaAd;
  isEditing: boolean;
  editedAd: MetaAd;
  onInputChange: (field: keyof MetaAd, value: string) => void;
  onGenerateImage: () => Promise<void>;
  loadingImageIndex: boolean;
}

const AdDetailsSection: React.FC<AdDetailsSectionProps> = ({
  displayAd,
  isEditing,
  editedAd,
  onInputChange,
  onGenerateImage,
  loadingImageIndex
}) => {
  return (
    <div className="space-y-3 text-sm mt-4">
      <div>
        <span className="font-medium text-gray-700">Primary Text:</span>
        {isEditing ? (
          <Textarea
            value={editedAd.primaryText}
            onChange={(e) => onInputChange('primaryText', e.target.value)}
            className="mt-1 text-sm min-h-[80px]"
            rows={3}
            maxLength={125}
            placeholder="Main caption for your ad"
          />
        ) : (
          <p className="mt-1 pl-2 text-gray-600">{displayAd.primaryText}</p>
        )}
      </div>
      
      <div>
        <span className="font-medium text-gray-700">Headline:</span>
        {isEditing ? (
          <Input
            value={editedAd.headline}
            onChange={(e) => onInputChange('headline', e.target.value)}
            className="mt-1 text-sm"
            maxLength={40}
            placeholder="Bold headline text"
          />
        ) : (
          <p className="mt-1 pl-2 text-gray-600">{displayAd.headline}</p>
        )}
      </div>
      
      <div>
        <span className="font-medium text-gray-700">Description:</span>
        {isEditing ? (
          <Input
            value={editedAd.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="mt-1 text-sm"
            maxLength={30}
            placeholder="Brief description text"
          />
        ) : (
          <p className="mt-1 pl-2 text-gray-600">{displayAd.description}</p>
        )}
      </div>
      
      <div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Image Prompt:</span>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateImage}
              disabled={loadingImageIndex}
            >
              {displayAd.imageUrl ? "Regenerate Image" : "Generate Image"}
            </Button>
          )}
        </div>
        {isEditing ? (
          <Textarea
            value={editedAd.imagePrompt}
            onChange={(e) => onInputChange('imagePrompt', e.target.value)}
            className="mt-1 text-sm min-h-[80px]"
            rows={3}
            placeholder="Detailed description of the image you want to generate"
          />
        ) : (
          <p className="mt-1 pl-2 text-xs text-gray-500">{displayAd.imagePrompt}</p>
        )}
      </div>
    </div>
  );
};

export default AdDetailsSection;
