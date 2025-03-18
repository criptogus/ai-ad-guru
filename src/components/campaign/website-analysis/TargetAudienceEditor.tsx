
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TargetAudienceEditorProps {
  targetAudience: string;
  onChange: (value: string) => void;
}

const TargetAudienceEditor: React.FC<TargetAudienceEditorProps> = ({
  targetAudience,
  onChange
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h4 className="font-medium text-gray-700 mb-2">Target Audience</h4>
      <Textarea
        value={targetAudience}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
    </div>
  );
};

export default TargetAudienceEditor;
