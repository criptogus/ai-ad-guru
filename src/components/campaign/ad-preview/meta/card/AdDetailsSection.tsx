
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetaAd } from "@/hooks/adGeneration";

interface AdDetailsSectionProps {
  ad: MetaAd;
  onUpdate?: (updatedAd: MetaAd) => void;
}

const AdDetailsSection: React.FC<AdDetailsSectionProps> = ({
  ad,
  onUpdate
}) => {
  const handleChange = (field: keyof MetaAd, value: string) => {
    if (onUpdate) {
      const updatedAd = { ...ad, [field]: value };
      console.log(`AdDetailsSection - Updating field "${field}" with value:`, value);
      console.log("AdDetailsSection - Full updated ad:", updatedAd);
      onUpdate(updatedAd);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="headline" className="mb-1 block">Headline</Label>
        <Input
          id="headline"
          value={ad.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="primaryText" className="mb-1 block">Primary Text</Label>
        <Textarea
          id="primaryText"
          value={ad.primaryText}
          onChange={(e) => handleChange('primaryText', e.target.value)}
          className="w-full min-h-[80px]"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="mb-1 block">Description</Label>
        <Input
          id="description"
          value={ad.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <Label htmlFor="imagePrompt" className="mb-1 block">Image Prompt</Label>
        <Textarea
          id="imagePrompt"
          value={ad.imagePrompt}
          onChange={(e) => handleChange('imagePrompt', e.target.value)}
          className="w-full min-h-[100px]"
          placeholder="Describe the image you want to generate..."
        />
      </div>
      
      {/* Display image URL for debugging */}
      {process.env.NODE_ENV !== 'production' && ad.imageUrl && (
        <div className="text-xs text-gray-500 border-t pt-2 mt-4">
          <p className="font-semibold">Debug Info:</p>
          <p className="break-all">Image URL: {ad.imageUrl}</p>
        </div>
      )}
    </div>
  );
};

export default AdDetailsSection;
