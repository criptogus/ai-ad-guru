
import React from "react";
import { Input } from "@/components/ui/input";

interface CtaEditorProps {
  callToActions: string[];
  onCtaChange: (index: number, value: string) => void;
}

const CtaEditor: React.FC<CtaEditorProps> = ({
  callToActions,
  onCtaChange
}) => {
  return (
    <div className="bg-card dark:bg-card p-4 rounded-md shadow-sm">
      <h4 className="font-medium text-foreground mb-2">Call to Action Suggestions</h4>
      <div className="space-y-2">
        {callToActions.map((cta, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {index + 1}
            </span>
            <Input
              value={cta}
              onChange={(e) => onCtaChange(index, e.target.value)}
              className="flex-1 bg-background dark:bg-background"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CtaEditor;
