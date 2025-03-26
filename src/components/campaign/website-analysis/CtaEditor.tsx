
import React from "react";
import { Input } from "@/components/ui/input";

export interface CtaEditorProps {
  callToActions: string[];
  onCtaChange: (index: number, value: string) => void;
}

const CtaEditor: React.FC<CtaEditorProps> = ({
  callToActions,
  onCtaChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Call to Actions</label>
      <div className="space-y-2">
        {callToActions.map((cta, index) => (
          <div key={`cta-${index}`} className="flex items-center">
            <span className="text-xs text-muted-foreground w-8">{index + 1}.</span>
            <Input
              value={cta}
              onChange={(e) => onCtaChange(index, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Action phrases to drive conversions
      </p>
    </div>
  );
};

export default CtaEditor;
