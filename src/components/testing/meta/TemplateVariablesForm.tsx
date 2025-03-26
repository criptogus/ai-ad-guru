
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
      <div className="flex items-center gap-2">
        <span className="text-xl">{getCategoryEmoji(selectedTemplate.category)}</span>
        <div>
          <Label className="text-sm font-semibold">{selectedTemplate.title}</Label>
          <p className="text-xs text-muted-foreground">{getCategoryName(selectedTemplate.category)}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="mainText">Main Text</Label>
        <Input
          id="mainText"
          value={mainText}
          onChange={(e) => setMainText(e.target.value)}
          placeholder="Enter main text for template"
        />
        <p className="text-xs text-muted-foreground">This text will replace the variable in the prompt.</p>
      </div>
    </div>
  );
};

function getCategoryEmoji(categoryId: string): string {
  const emojiMap: Record<string, string> = {
    "urgency": "🔥",
    "personal-branding": "👤",
    "e-commerce": "🛍️",
    "education": "📚",
    "social": "💬"
  };
  
  return emojiMap[categoryId] || "✨";
}

function getCategoryName(categoryId: string): string {
  const categoryMap: Record<string, string> = {
    "urgency": "Urgency & Scarcity",
    "personal-branding": "Personal Branding",
    "e-commerce": "E-commerce / Retail",
    "education": "Education / EdTech",
    "social": "Social & Engagement",
  };
  
  return categoryMap[categoryId] || categoryId;
}

export default TemplateVariablesForm;
