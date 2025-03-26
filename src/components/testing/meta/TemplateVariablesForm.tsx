
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InstagramTemplate } from "../instagram/InstagramTemplateGallery";

interface TemplateVariablesFormProps {
  selectedTemplate: InstagramTemplate | null;
  mainText: string;
  setMainText: (value: string) => void;
}

const TemplateVariablesForm: React.FC<TemplateVariablesFormProps> = ({
  selectedTemplate,
  mainText,
  setMainText
}) => {
  if (!selectedTemplate) return null;
  
  return (
    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
      <div>
        <Label className="text-sm font-semibold">Selected Template</Label>
        <p className="text-xs text-muted-foreground">{selectedTemplate.title}</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mainText">Main Text</Label>
        <Input
          id="mainText"
          value={mainText}
          onChange={(e) => setMainText(e.target.value)}
          placeholder="Enter main text for template"
        />
      </div>
    </div>
  );
};

export default TemplateVariablesForm;
