
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";

interface TemplateVariablesFormProps {
  selectedTemplate: InstagramTemplate;
  mainText: string;
  setMainText: (text: string) => void;
}

const TemplateVariablesForm: React.FC<TemplateVariablesFormProps> = ({
  selectedTemplate,
  mainText,
  setMainText,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Template: {selectedTemplate.name}</h3>
        <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
      </div>
      
      <div>
        <Label htmlFor="mainText">Main Text</Label>
        <Textarea
          id="mainText"
          value={mainText}
          onChange={(e) => setMainText(e.target.value)}
          placeholder="Enter your main text for this template"
          className="resize-none"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          This text will appear in the main content area of your Instagram post
        </p>
      </div>
    </div>
  );
};

export default TemplateVariablesForm;
