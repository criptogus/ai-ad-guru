
import React from "react";
import { Sparkles } from "lucide-react";

interface AIInsightsSuggestionsProps {
  insights: string[];
  accepting?: boolean;
  onAccept?: () => void;
}

export const AIInsightsSuggestions: React.FC<AIInsightsSuggestionsProps> = ({ 
  insights,
  accepting = false,
  onAccept = () => {} 
}) => {
  return (
    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
      <h4 className="text-sm font-medium flex items-center text-blue-800">
        <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
        AI Suggestions
      </h4>
      <ul className="mt-2 space-y-2 text-sm">
        {insights.map((insight, index) => (
          <li key={index} className="flex items-start">
            <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
              {index + 1}
            </span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
      {onAccept && (
        <div className="mt-4">
          <button 
            onClick={onAccept}
            disabled={accepting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            {accepting ? 'Applying...' : 'Apply Suggestions'}
          </button>
        </div>
      )}
    </div>
  );
};
