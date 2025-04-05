
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TriggerButtonInline from "../ad-preview/TriggerButtonInline";
import { useMentalTriggers } from "@/hooks/useMentalTriggers";

interface AdTextEditorProps {
  headline: string;
  description: string;
  onHeadlineChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  isEditable?: boolean;
  headlineLimit?: number;
  descriptionLimit?: number;
}

const AdTextEditor: React.FC<AdTextEditorProps> = ({
  headline,
  description,
  onHeadlineChange,
  onDescriptionChange,
  isEditable = true,
  headlineLimit = 30,
  descriptionLimit = 90
}) => {
  const { insertTrigger } = useMentalTriggers();

  const handleInsertTrigger = (triggerText: string) => {
    insertTrigger(triggerText, 'headline', headline, (_, value) => onHeadlineChange(value));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="headline">Headline</Label>
          {isEditable && (
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">
                {headline.length}/{headlineLimit}
              </span>
              <TriggerButtonInline onInsert={handleInsertTrigger} />
            </div>
          )}
        </div>
        <Input
          id="headline"
          value={headline}
          onChange={(e) => onHeadlineChange(e.target.value)}
          maxLength={headlineLimit}
          disabled={!isEditable}
          className={!isEditable ? "bg-muted" : ""}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Description</Label>
          <span className="text-xs text-muted-foreground">
            {description.length}/{descriptionLimit}
          </span>
        </div>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          maxLength={descriptionLimit}
          disabled={!isEditable}
          className={`resize-none ${!isEditable ? "bg-muted" : ""}`}
          rows={3}
        />
      </div>
    </div>
  );
};

export default AdTextEditor;
