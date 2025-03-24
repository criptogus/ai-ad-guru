
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectPrompt }) => {
  const promptTemplates = [
    {
      name: "Tech Innovation",
      prompt: "A sleek, futuristic device or interface in a minimalist setting, conveying innovation and cutting-edge technology"
    },
    {
      name: "Professional Success",
      prompt: "A confident professional in a modern workspace with subtle elements of success and achievement"
    },
    {
      name: "Business Growth",
      prompt: "Abstract visualization of business growth with upward trends, expanding elements, and professional aesthetics"
    },
    {
      name: "Team Collaboration",
      prompt: "Diverse team in a modern office environment collaborating effectively with visible synergy and productivity"
    },
    {
      name: "Premium Service",
      prompt: "High-end representation of professional service with dramatic lighting and premium atmosphere"
    }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-sm">Quick Prompt Templates</Label>
      <div className="grid grid-cols-1 gap-2">
        {promptTemplates.map((template, idx) => (
          <Button 
            key={idx} 
            variant="outline" 
            size="sm" 
            className="justify-start h-auto py-2 px-3 text-left w-full"
            onClick={() => onSelectPrompt(template.prompt)}
          >
            <div className="w-full">
              <p className="font-medium truncate">{template.name}</p>
              <p className="text-xs text-muted-foreground break-words line-clamp-2">
                {template.prompt}
              </p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PromptTemplates;
