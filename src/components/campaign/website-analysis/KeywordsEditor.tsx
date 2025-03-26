
import React from "react";
import { Input } from "@/components/ui/input";

export interface KeywordsEditorProps {
  keywords: string[];
  onKeywordChange: (index: number, value: string) => void;
}

const KeywordsEditor: React.FC<KeywordsEditorProps> = ({
  keywords,
  onKeywordChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Keywords</label>
      <div className="space-y-2">
        {keywords.map((keyword, index) => (
          <div key={`keyword-${index}`} className="flex items-center">
            <span className="text-xs text-muted-foreground w-8">{index + 1}.</span>
            <Input
              value={keyword}
              onChange={(e) => onKeywordChange(index, e.target.value)}
              className="flex-1"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Keywords that describe your business
      </p>
    </div>
  );
};

export default KeywordsEditor;
