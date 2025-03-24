
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MetaAd } from "@/hooks/adGeneration";

interface NewMetaAdFormProps {
  newAd: MetaAd;
  setNewAd: React.Dispatch<React.SetStateAction<MetaAd>>;
  onAddTestAd: () => void;
}

const NewMetaAdForm: React.FC<NewMetaAdFormProps> = ({
  newAd,
  setNewAd,
  onAddTestAd
}) => {
  const handleChange = (field: keyof MetaAd, value: string) => {
    setNewAd(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Create Test Ad</h3>
      
      <div>
        <Label htmlFor="headline">Headline (150 chars max)</Label>
        <Input
          id="headline"
          value={newAd.headline}
          onChange={(e) => handleChange('headline', e.target.value)}
          maxLength={150}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {newAd.headline.length}/150 characters
        </div>
      </div>
      
      <div>
        <Label htmlFor="primaryText">Primary Text (600 chars max)</Label>
        <Textarea
          id="primaryText"
          value={newAd.primaryText}
          onChange={(e) => handleChange('primaryText', e.target.value)}
          maxLength={600}
          rows={3}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {newAd.primaryText.length}/600 characters
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description/CTA (150 chars max)</Label>
        <Input
          id="description"
          value={newAd.description}
          onChange={(e) => handleChange('description', e.target.value)}
          maxLength={150}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {newAd.description.length}/150 characters
        </div>
      </div>
      
      <div>
        <Label htmlFor="imagePrompt">Image Prompt</Label>
        <Textarea
          id="imagePrompt"
          value={newAd.imagePrompt}
          onChange={(e) => handleChange('imagePrompt', e.target.value)}
          rows={3}
          placeholder="Describe the image you want to generate..."
        />
      </div>
      
      <Button onClick={onAddTestAd}>
        Add Test Ad
      </Button>
    </div>
  );
};

export default NewMetaAdForm;
