
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { Button } from "@/components/ui/button";
import { FormField, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit, Check, X, Copy } from "lucide-react";
import CharacterCountIndicator from "../CharacterCountIndicator";
import { TriggerButton } from "@/components/mental-triggers/TriggerButton";

interface InstagramAdEditorProps {
  ad: MetaAd;
  onUpdateAd: (updatedAd: MetaAd) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCopy: () => void;
}

const InstagramAdEditor: React.FC<InstagramAdEditorProps> = ({
  ad,
  onUpdateAd,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onCopy,
}) => {
  const handleTextChange = (field: keyof MetaAd, value: string) => {
    onUpdateAd({
      ...ad,
      [field]: value,
    });
  };

  const handleInsertTrigger = (text: string) => {
    // Default to inserting in primaryText
    handleTextChange('primaryText', 
      ad.primaryText 
        ? `${ad.primaryText}\n\n${text}` 
        : text
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium">Ad Content</h3>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={onSave}
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mb-2">
          <TriggerButton
            onSelectTrigger={handleInsertTrigger}
            buttonText="Add Mind Trigger"
            tooltip="Insert psychological triggers to improve ad performance"
            variant="outline"
            size="sm"
          />
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Caption</label>
          {isEditing && <CharacterCountIndicator text={ad.primaryText || ''} limit={2200} />}
        </div>
        <FormField
          control={{} as any}
          name="primaryText"
          render={({ field }) => (
            <FormControl>
              <Textarea
                value={ad.primaryText || ''}
                onChange={(e) => handleTextChange('primaryText', e.target.value)}
                placeholder="Enter primary text"
                readOnly={!isEditing}
                className={`resize-none h-32 ${!isEditing ? "bg-muted" : ""}`}
              />
            </FormControl>
          )}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Headline</label>
          {isEditing && <CharacterCountIndicator text={ad.headline || ''} limit={40} />}
        </div>
        <FormField
          control={{} as any}
          name="headline"
          render={() => (
            <FormControl>
              <Input
                value={ad.headline || ''}
                onChange={(e) => handleTextChange('headline', e.target.value)}
                placeholder="Enter headline"
                readOnly={!isEditing}
                maxLength={40}
                className={!isEditing ? "bg-muted" : ""}
              />
            </FormControl>
          )}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Description</label>
          {isEditing && <CharacterCountIndicator text={ad.description || ''} limit={30} />}
        </div>
        <FormField
          control={{} as any}
          name="description"
          render={() => (
            <FormControl>
              <Input
                value={ad.description || ''}
                onChange={(e) => handleTextChange('description', e.target.value)}
                placeholder="Enter description"
                readOnly={!isEditing}
                maxLength={30}
                className={!isEditing ? "bg-muted" : ""}
              />
            </FormControl>
          )}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">Image Prompt</label>
          {isEditing && <CharacterCountIndicator text={ad.imagePrompt || ''} limit={1000} />}
        </div>
        <FormField
          control={{} as any}
          name="imagePrompt"
          render={() => (
            <FormControl>
              <Textarea
                value={ad.imagePrompt || ''}
                onChange={(e) => handleTextChange('imagePrompt', e.target.value)}
                placeholder="Enter image generation prompt"
                readOnly={!isEditing}
                className={`resize-none h-20 ${!isEditing ? "bg-muted" : ""}`}
              />
            </FormControl>
          )}
        />
      </div>
    </div>
  );
};

export default InstagramAdEditor;
