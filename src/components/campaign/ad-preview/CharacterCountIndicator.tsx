
import React from "react";
import { Edit } from "lucide-react";

interface CharacterCountIndicatorProps {
  label: string;
  currentCount: number;
  maxCount: number;
  onEdit?: () => void;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const CharacterCountIndicator: React.FC<CharacterCountIndicatorProps> = ({
  label,
  currentCount,
  maxCount,
  onEdit,
  position = "top-right"
}) => {
  // Determine position classes
  const positionClasses = {
    "top-right": "top-1 right-1",
    "top-left": "top-1 left-1",
    "bottom-right": "bottom-1 right-1",
    "bottom-left": "bottom-1 left-1"
  };

  // Calculate percentage for color indication
  const percentage = (currentCount / maxCount) * 100;
  let indicatorColor = "text-green-600";
  
  if (percentage > 90) {
    indicatorColor = "text-red-600";
  } else if (percentage > 75) {
    indicatorColor = "text-amber-600";
  }

  return (
    <div className={`absolute ${positionClasses[position]} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
      <div className="bg-white border border-gray-200 shadow-sm rounded-md p-1.5 flex items-center space-x-2">
        <div>
          <div className="text-xs font-medium text-gray-700">{label}</div>
          <div className={`text-xs ${indicatorColor}`}>
            {currentCount}/{maxCount} characters
          </div>
        </div>
        
        {onEdit && (
          <button 
            onClick={onEdit}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit className="h-3.5 w-3.5 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterCountIndicator;
