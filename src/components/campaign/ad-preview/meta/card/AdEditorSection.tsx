
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MetaAd } from "@/hooks/adGeneration";

interface EditorSectionProps {
  ad: MetaAd;
  isEditing: boolean;
  onUpdate: (updatedAd: MetaAd) => void;
  onSelectTrigger?: (trigger: string) => void;
}

const AdEditorSection: React.FC<EditorSectionProps> = ({ ad, isEditing, onUpdate, onSelectTrigger }) => {
  const [editedAd, setEditedAd] = useState<MetaAd>(ad);

  if (!isEditing) return null;

  const handleChange = (field: keyof MetaAd, value: string) => {
    setEditedAd(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update the parent component with changes
    onUpdate({
      ...editedAd,
      [field]: value
    });
  };

  return (
    <div className="space-y-4 p-4 border-t">
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          value={editedAd.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="primaryText">Primary Text</Label>
        <Textarea
          id="primaryText"
          value={editedAd.primaryText}
          onChange={(e) => handleChange('primaryText', e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={editedAd.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="format">Format</Label>
        <Select
          value={editedAd.format || 'feed'}
          onValueChange={(value) => handleChange('format', value as 'feed' | 'story' | 'reel')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feed">Feed</SelectItem>
            <SelectItem value="story">Story</SelectItem>
            <SelectItem value="reel">Reel</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="imagePrompt">Image Prompt</Label>
        <Textarea
          id="imagePrompt"
          value={editedAd.imagePrompt}
          onChange={(e) => handleChange('imagePrompt', e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
      
      <div>
        <Label htmlFor="callToAction">Call to Action</Label>
        <Input
          id="callToAction"
          value={editedAd.callToAction || ''}
          onChange={(e) => handleChange('callToAction', e.target.value)}
          className="mt-1"
        />
      </div>
      
      {onSelectTrigger && (
        <div className="pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onSelectTrigger('urgency')}
            className="mr-2 mb-2"
          >
            Add Urgency
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onSelectTrigger('scarcity')}
            className="mr-2 mb-2"
          >
            Add Scarcity
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onSelectTrigger('social proof')}
            className="mb-2"
          >
            Add Social Proof
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdEditorSection;
