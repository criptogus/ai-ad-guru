
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, MessageSquare, Sparkles } from "lucide-react";
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
    <Card className="cursor-pointer hover:border-primary/50 transition-colors h-full flex flex-col overflow-hidden">
      <CardHeader className="p-3 pb-2 flex-shrink-0 border-b">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-sm line-clamp-1 flex items-center">
            <span className="mr-1.5">{getCategoryEmoji(template.category)}</span>
            {template.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2 flex-grow">
        <p className="text-xs line-clamp-2 text-muted-foreground">
          {template.prompt.substring(0, 100)}
          {template.prompt.length > 100 && '...'}
        </p>
      </CardContent>
      <CardFooter className="p-3 pt-2 flex-shrink-0 bg-muted/30">
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
