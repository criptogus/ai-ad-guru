
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
      <CardHeader className="p-3 pb-2 border-b">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{getCategoryEmoji(template.category)}</span>
            <h4 className="text-sm font-medium line-clamp-1">{template.title}</h4>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-3 flex-grow">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.prompt.substring(0, 100)}
          {template.prompt.length > 100 && '...'}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-2 bg-muted/10">
        <Button 
          size="sm" 
          variant="secondary" 
          className="w-full h-7 text-xs"
          onClick={() => onSelect(template)}
        >
          <Sparkles className="h-3.5 w-3.5 mr-1" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};
