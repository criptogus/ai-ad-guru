
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface UspEditorProps {
  uniqueSellingPoints: string[];
  onUspChange: (index: number, value: string) => void;
}

const UspEditor: React.FC<UspEditorProps> = ({
  uniqueSellingPoints,
  onUspChange
}) => {
  return (
    <div className="bg-card dark:bg-card p-4 rounded-md shadow-sm md:col-span-2">
      <h4 className="font-medium text-foreground mb-2">Unique Selling Points</h4>
      <div className="space-y-3 mt-2">
        {uniqueSellingPoints.map((usp, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs">
              {index + 1}
            </span>
            <Textarea
              value={usp}
              onChange={(e) => onUspChange(index, e.target.value)}
              className="flex-1 bg-background dark:bg-background"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UspEditor;
