
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TriggerButtonInline from "@/components/campaign/ad-preview/TriggerButtonInline";

interface AdTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
  className?: string;
  showInsertTrigger?: boolean;
}

const AdTextEditor: React.FC<AdTextEditorProps> = ({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  rows = 3,
  className = "",
  showInsertTrigger = true
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (maxLength !== undefined && newValue.length > maxLength) {
      return;
    }
    onChange(newValue);
  };

  const handleInsertTrigger = (text: string) => {
    // Insert the text at cursor position or at the end
    onChange(value ? `${value}\n\n${text}` : text);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex justify-between items-center">
        <Label htmlFor={`text-${label}`}>{label}</Label>
        <div className="flex items-center gap-2">
          {showInsertTrigger && (
            <TriggerButtonInline onInsert={handleInsertTrigger} />
          )}
          {maxLength && (
            <span className="text-xs text-muted-foreground">
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      </div>
      
      <Textarea
        id={`text-${label}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};

export default AdTextEditor;
