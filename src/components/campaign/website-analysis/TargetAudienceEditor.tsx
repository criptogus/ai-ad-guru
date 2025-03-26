
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TargetAudienceEditorProps {
  targetAudience: string;
  onChange: (value: string) => void;
}

const TargetAudienceEditor: React.FC<TargetAudienceEditorProps> = ({
  targetAudience,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="targetAudience">Target Audience</Label>
      <Textarea
        id="targetAudience"
        value={targetAudience}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Describe your target audience (demographics, interests, behaviors)"
        className="bg-background dark:bg-background"
      />
    </div>
  );
};

export default TargetAudienceEditor;
