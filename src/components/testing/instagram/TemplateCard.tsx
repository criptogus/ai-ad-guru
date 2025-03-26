
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, MessageSquare } from "lucide-react";
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
    <Card className="cursor-pointer hover:border-primary transition-colors h-full flex flex-col">
      <CardHeader className="p-4 pb-2 flex-shrink-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md line-clamp-1">{template.title}</CardTitle>
        </div>
        <Badge variant="outline" className="w-fit">
          {getCategoryEmoji(template.category)} {template.category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <p className="text-sm line-clamp-3 text-muted-foreground">
          {template.prompt.substring(0, 150)}
          {template.prompt.length > 150 && '...'}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex-shrink-0">
        <Button 
          size="sm" 
          variant="secondary" 
          className="w-full"
          onClick={() => onSelect(template)}
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1" />
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};
