
import React from "react";
import { Input } from "@/components/ui/input";

interface KeywordsEditorProps {
  keywords: string[];
  onKeywordChange: (index: number, value: string) => void;
}

const KeywordsEditor: React.FC<KeywordsEditorProps> = ({
  keywords,
  onKeywordChange
}) => {
  return (
    <div className="bg-card dark:bg-card p-4 rounded-md shadow-sm">
      <h4 className="font-medium text-foreground mb-2">Keywords</h4>
      <div className="space-y-2">
        {keywords.map((keyword, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs">
              {index + 1}
            </span>
            <Input
              value={keyword}
              onChange={(e) => onKeywordChange(index, e.target.value)}
              className="flex-1 bg-background dark:bg-background"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordsEditor;
