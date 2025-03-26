
import React from "react";
import { Textarea } from "@/components/ui/textarea";

export interface UspEditorProps {
  uniqueSellingPoints: string[];
  onUspChange: (index: number, value: string) => void;
}

const UspEditor: React.FC<UspEditorProps> = ({
  uniqueSellingPoints,
  onUspChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Unique Selling Points</label>
      <div className="space-y-3">
        {uniqueSellingPoints.map((usp, index) => (
          <div key={`usp-${index}`} className="flex items-start">
            <span className="text-xs text-muted-foreground w-8 mt-2">{index + 1}.</span>
            <Textarea
              value={usp}
              onChange={(e) => onUspChange(index, e.target.value)}
              className="flex-1 resize-none"
              rows={2}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        What makes your business unique
      </p>
    </div>
  );
};

export default UspEditor;
