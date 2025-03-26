
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image, Sparkles } from "lucide-react";
import { EditorSectionProps } from "./types";
import { TriggerButtonInline } from "../../TriggerButtonInline";
import TemplateGallery, { AdTemplate } from "../../template-gallery/TemplateGallery";

const AdEditorSection: React.FC<EditorSectionProps> = ({
  ad,
  isEditing,
  onUpdate,
  onSelectTrigger
}) => {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

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

  const handleTemplateSelect = (template: AdTemplate) => {
    // Update the ad's image prompt with the selected template
    handleChange("imagePrompt", template.prompt);
    setShowTemplateGallery(false);
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
            <div className="mt-2 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => setShowTemplateGallery(true)}
              >
                <Image className="h-4 w-4 mr-2" />
                Ad Template Gallery
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full"
                onClick={() => handleTriggerSelect("Create a professional Instagram ad that highlights our product benefits in a visually appealing way.")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Quick Prompt
              </Button>
            </div>
          </div>
        </>
      )}

      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
        onSelectTemplate={handleTemplateSelect}
        platform="instagram"
      />
    </div>
  );
};

export default AdEditorSection;
