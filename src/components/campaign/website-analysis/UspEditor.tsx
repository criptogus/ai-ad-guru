
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
    <div className="bg-white p-4 rounded-md shadow-sm md:col-span-2">
      <h4 className="font-medium text-gray-700 mb-2">Unique Selling Points</h4>
      <div className="space-y-3 mt-2">
        {uniqueSellingPoints.map((usp, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="bg-purple-100 text-purple-800 w-6 h-6 rounded-full flex items-center justify-center mt-1 text-xs">
              {index + 1}
            </span>
            <Textarea
              value={usp}
              onChange={(e) => onUspChange(index, e.target.value)}
              className="flex-1"
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UspEditor;
