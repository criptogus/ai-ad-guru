
import React from "react";
import { Sparkles } from "lucide-react";

interface Suggestion {
  id: number;
  text: string;
}

interface AIInsightsSuggestionsProps {
  suggestions: Suggestion[];
}

export const AIInsightsSuggestions: React.FC<AIInsightsSuggestionsProps> = ({ suggestions }) => {
  return (
    <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
      <h4 className="text-sm font-medium flex items-center text-blue-800">
        <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
        AI Suggestions
      </h4>
      <ul className="mt-2 space-y-2 text-sm">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} className="flex items-start">
            <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
              {suggestion.id}
            </span>
            <span>{suggestion.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
