
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MetaAd } from "@/hooks/adGeneration";
import MentalTriggersSection from "../MentalTriggersSection";
import { TriggerButtonInline } from "../TriggerButtonInline";

interface InstagramAdEditorProps {
  ad: MetaAd;
  onChange: (updatedAd: MetaAd) => void;
}

const InstagramAdEditor: React.FC<InstagramAdEditorProps> = ({ ad, onChange }) => {
  const handleChange = (field: keyof MetaAd, value: string) => {
    onChange({ ...ad, [field]: value });
  };

  const handleInsertTrigger = (field: keyof MetaAd, text: string) => {
    // Insert the trigger text into the specified field
    const currentText = ad[field] as string || '';
    handleChange(field, currentText ? `${currentText}\n\n${text}` : text);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="headline">Headline (150 chars max)</Label>
                <TriggerButtonInline 
                  onInsert={(text) => handleInsertTrigger('headline', text)} 
                  className="mb-1"
                />
              </div>
              <Input
                id="headline"
                value={ad.headline || ''}
                onChange={(e) => handleChange('headline', e.target.value)}
                maxLength={150}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {(ad.headline?.length || 0)}/150 characters
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="primaryText">Primary Text (600 chars max)</Label>
                <TriggerButtonInline 
                  onInsert={(text) => handleInsertTrigger('primaryText', text)}
                  className="mb-1" 
                />
              </div>
              <Textarea
                id="primaryText"
                value={ad.primaryText || ''}
                onChange={(e) => handleChange('primaryText', e.target.value)}
                maxLength={600}
                rows={4}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {(ad.primaryText?.length || 0)}/600 characters
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Description / CTA (150 chars max)</Label>
                <TriggerButtonInline 
                  onInsert={(text) => handleInsertTrigger('description', text)}
                  className="mb-1" 
                />
              </div>
              <Input
                id="description"
                value={ad.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                maxLength={150}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {(ad.description?.length || 0)}/150 characters
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <MentalTriggersSection onSelectTrigger={(text) => handleInsertTrigger('primaryText', text)} />
    </div>
  );
};

export default InstagramAdEditor;
