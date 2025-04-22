
import React from "react";
import { MetaAd } from "@/hooks/adGeneration/types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TriggerButton } from "@/components/mental-triggers/TriggerButton";
import { Smartphone, Video, Newspaper } from "lucide-react";

interface AdEditorSectionProps {
  ad: MetaAd;
  isEditing: boolean;
  onUpdate: (updatedAd: MetaAd) => void;
  onSelectTrigger?: (trigger: string) => void;
}

const AdEditorSection: React.FC<AdEditorSectionProps> = ({
  ad,
  isEditing,
  onUpdate,
  onSelectTrigger
}) => {
  const handleFieldChange = (field: keyof MetaAd, value: string) => {
    onUpdate({
      ...ad,
      [field]: value
    });
  };

  const handleFormatChange = (value: string) => {
    if (value === 'feed' || value === 'story' || value === 'reel') {
      onUpdate({
        ...ad,
        format: value
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Format selection */}
      <div>
        <Label className="mb-2 block">Ad Format</Label>
        <ToggleGroup 
          type="single" 
          variant="outline"
          value={ad.format || "feed"}
          onValueChange={handleFormatChange}
          className="justify-start"
          disabled={!isEditing}
        >
          <ToggleGroupItem value="feed" className="gap-1">
            <Newspaper className="h-4 w-4" />
            <span>Feed</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="story" className="gap-1">
            <Smartphone className="h-4 w-4" />
            <span>Story</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="reel" className="gap-1">
            <Video className="h-4 w-4" />
            <span>Reel</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Headline */}
      <div>
        <Label htmlFor="headline" className="mb-2 block">
          Headline (40 char limit)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="headline"
            value={ad.headline}
            onChange={(e) => handleFieldChange("headline", e.target.value)}
            maxLength={40}
            className="font-medium"
            readOnly={!isEditing}
          />
          <span className="text-xs text-muted-foreground w-12 flex-shrink-0">
            {ad.headline.length}/40
          </span>
        </div>
      </div>

      {/* Primary Text */}
      <div>
        <Label htmlFor="primaryText" className="mb-2 block">
          Primary Text (125 char limit)
        </Label>
        <div className="flex items-start gap-2">
          <Textarea
            id="primaryText"
            value={ad.primaryText}
            onChange={(e) => handleFieldChange("primaryText", e.target.value)}
            maxLength={125}
            className="min-h-24 resize-none"
            readOnly={!isEditing}
          />
          <span className="text-xs text-muted-foreground w-12 flex-shrink-0 pt-2">
            {ad.primaryText.length}/125
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="mb-2 block">
          Description / Call to Action (30 char limit)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="description"
            value={ad.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            maxLength={30}
            readOnly={!isEditing}
          />
          <span className="text-xs text-muted-foreground w-12 flex-shrink-0">
            {ad.description.length}/30
          </span>
        </div>
      </div>

      {/* Image Prompt */}
      <div>
        <Label htmlFor="imagePrompt" className="mb-2 block">
          Image Prompt
        </Label>
        <div className="flex items-start gap-2">
          <Textarea
            id="imagePrompt"
            value={ad.imagePrompt || ""}
            onChange={(e) => handleFieldChange("imagePrompt", e.target.value)}
            className="min-h-24 resize-none"
            placeholder={isEditing ? "Describe the image you want to generate..." : "No image prompt provided"}
            readOnly={!isEditing}
          />
        </div>
      </div>

      {/* Mind Triggers */}
      {isEditing && onSelectTrigger && (
        <div>
          <Label className="mb-2 block">Mind Triggers</Label>
          <div className="grid grid-cols-1 gap-2">
            <TriggerButton
              onSelectTrigger={onSelectTrigger}
              buttonText="Add Mind Trigger"
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdEditorSection;
