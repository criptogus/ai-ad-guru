
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
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h4 className="font-medium text-gray-700 mb-2">Call to Action Suggestions</h4>
      <div className="space-y-2">
        {callToActions.map((cta, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {index + 1}
            </span>
            <Input
              value={cta}
              onChange={(e) => onCtaChange(index, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CtaEditor;
