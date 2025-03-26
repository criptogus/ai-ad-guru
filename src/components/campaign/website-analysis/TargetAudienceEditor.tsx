
import React from "react";
import { Textarea } from "@/components/ui/textarea";

export interface TargetAudienceEditorProps {
  targetAudience: string;
  onChange: (value: string) => void;
}

const TargetAudienceEditor: React.FC<TargetAudienceEditorProps> = ({
  targetAudience,
  onChange
}) => {
  return (
    <div>
      <label htmlFor="target-audience" className="block text-sm font-medium mb-1">
        Target Audience
      </label>
      <Textarea
        id="target-audience"
        value={targetAudience}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none"
        rows={4}
      />
      <p className="text-xs text-muted-foreground mt-1">
        Describe who you're targeting with your ads
      </p>
    </div>
  );
};

export default TargetAudienceEditor;
