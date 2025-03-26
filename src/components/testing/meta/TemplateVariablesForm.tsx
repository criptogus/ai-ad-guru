
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { InstagramTemplate } from "../instagram/InstagramTemplateGallery";
import { categories } from "../instagram/templateData";

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
    <Card className="overflow-hidden">
      <CardHeader className="p-5 pb-3 bg-muted/20">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryEmoji(selectedTemplate.category)}</span>
          <div>
            <h3 className="text-lg font-semibold">{selectedTemplate.title}</h3>
            <p className="text-sm text-muted-foreground">{getCategoryName(selectedTemplate.category)}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mainText" className="text-base">Main Text</Label>
          <Input
            id="mainText"
            value={mainText}
            onChange={(e) => setMainText(e.target.value)}
            placeholder="Enter main text for template"
            className="h-12"
          />
          <p className="text-sm text-muted-foreground mt-2">
            This text will replace the variable in the prompt template.
          </p>
        </div>
        
        <div className="pt-2 pb-1">
          <h4 className="text-sm font-medium mb-2">Template Preview</h4>
          <div className="p-4 bg-muted/20 rounded-lg text-sm">
            {selectedTemplate.prompt.replace(/\${mainText:[^}]*}/, `<span class="font-semibold text-primary">${mainText || "[Your text here]"}</span>`)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getCategoryEmoji(categoryId: string): string {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.emoji : "✨";
}

function getCategoryName(categoryId: string): string {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
}

export default TemplateVariablesForm;
