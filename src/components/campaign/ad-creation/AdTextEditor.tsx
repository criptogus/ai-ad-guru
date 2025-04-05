
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TriggerButtonInline from "../ad-preview/TriggerButtonInline";
import { useMindTriggers } from "@/hooks/useMindTriggers";

interface AdTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
}

const AdTextEditor: React.FC<AdTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = "Enter text",
  maxLength,
  multiline = false,
}) => {
  const handleInsert = (text: string) => {
    onChange(text);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <Label>{label}</Label>
          {maxLength && (
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        {multiline ? (
          <Textarea 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className="resize-none"
            rows={3}
          />
        ) : (
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
          />
        )}
        
        <div className="self-end">
          <TriggerButtonInline 
            onSelectTrigger={handleInsert} 
            onInsert={handleInsert} 
          />
        </div>
      </div>
    </div>
  );
};

// Example of using TriggerButtonInline with onInsert
const TriggerInsertExample = ({ onInsert }: { onInsert: (text: string) => void }) => (
  <TriggerButtonInline 
    onSelectTrigger={onInsert} 
    onInsert={onInsert} 
  />
);

export default AdTextEditor;
