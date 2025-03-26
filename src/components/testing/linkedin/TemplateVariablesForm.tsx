
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PromptTemplate } from "@/hooks/template/usePromptTemplates";

interface TemplateVariablesFormProps {
  selectedTemplate: PromptTemplate | null;
  mainText: string;
  subText: string;
  setMainText: (value: string) => void;
  setSubText: (value: string) => void;
}

const TemplateVariablesForm: React.FC<TemplateVariablesFormProps> = ({
  selectedTemplate,
  mainText,
  subText,
  setMainText,
  setSubText
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
      
      <div className="space-y-2">
        <Label htmlFor="subText">Sub Text</Label>
        <Input
          id="subText"
          value={subText}
          onChange={(e) => setSubText(e.target.value)}
          placeholder="Enter sub text for template"
        />
      </div>
    </div>
  );
};

export default TemplateVariablesForm;
