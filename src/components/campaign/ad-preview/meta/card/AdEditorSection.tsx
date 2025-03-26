
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditorSectionProps } from "./types";
import { TriggerButtonInline } from "../../TriggerButtonInline";
import TemplateGalleryButton from "../instagram-preview/TemplateGalleryButton";

const AdEditorSection: React.FC<EditorSectionProps> = ({
  ad,
  isEditing,
  onUpdate,
  onSelectTrigger
}) => {
  const handleChange = (field: keyof typeof ad, value: string) => {
    onUpdate({
      ...ad,
      [field]: value
    });
  };

  const handleTriggerSelect = (trigger: string) => {
    if (onSelectTrigger) {
      onSelectTrigger(trigger);
    }
  };

  const handleTemplateSelect = (template: string) => {
    // Update the ad's image prompt with the selected template
    handleChange("imagePrompt", template);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-1">Headline</p>
        {isEditing ? (
          <Input 
            value={ad.headline} 
            onChange={(e) => handleChange("headline", e.target.value)}
            placeholder="Enter headline (25 chars max)"
            maxLength={25}
          />
        ) : (
          <p className="text-sm border p-2 rounded-md bg-muted/20">{ad.headline}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium">Primary Text</p>
          {isEditing && (
            <TriggerButtonInline onSelectTrigger={handleTriggerSelect} />
          )}
        </div>
        {isEditing ? (
          <Textarea 
            value={ad.primaryText} 
            onChange={(e) => handleChange("primaryText", e.target.value)}
            placeholder="Enter primary text (125 chars recommended)"
            rows={5}
          />
        ) : (
          <div className="text-sm border p-2 rounded-md bg-muted/20 whitespace-pre-line min-h-[100px]">
            {ad.primaryText}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium mb-1">Call to Action</p>
        {isEditing ? (
          <Input 
            value={ad.description || ""} 
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Enter CTA (e.g., 'Learn More', 'Shop Now')"
            maxLength={20}
          />
        ) : (
          <p className="text-sm border p-2 rounded-md bg-muted/20">{ad.description || "Learn More"}</p>
        )}
      </div>

      {isEditing && (
        <>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium">Image Prompt</p>
            </div>
            <Textarea 
              value={ad.imagePrompt || ""} 
              onChange={(e) => handleChange("imagePrompt", e.target.value)}
              placeholder="Describe the image you want to generate"
              rows={3}
            />
            <TemplateGalleryButton onSelectTemplate={handleTemplateSelect} />
          </div>
        </>
      )}
    </div>
  );
};

export default AdEditorSection;
