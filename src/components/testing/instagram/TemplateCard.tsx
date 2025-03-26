
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { InstagramTemplate } from './InstagramTemplateGallery';

interface TemplateCardProps {
  template: InstagramTemplate;
  onSelect: (template: InstagramTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  // Find the category emoji
  const getCategoryEmoji = (categoryId: string) => {
    const emojiMap: Record<string, string> = {
      "urgency": "🔥",
      "personal-branding": "👤",
      "e-commerce": "🛍️",
      "education": "📚",
      "social": "💬"
    };
    
    return emojiMap[categoryId] || "✨";
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow border-border/80">
      <CardHeader className="p-5 pb-3 border-b">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">{getCategoryEmoji(template.category)}</span>
            <h4 className="text-base font-medium">{template.title}</h4>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 flex-grow">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {template.prompt}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-3 bg-muted/10">
        <Button 
          size="sm" 
          variant="secondary" 
          className="w-full h-10 text-sm"
          onClick={() => onSelect(template)}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};
