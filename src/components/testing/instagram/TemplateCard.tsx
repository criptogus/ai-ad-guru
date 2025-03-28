
import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { InstagramTemplate } from "./InstagramTemplateGallery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface TemplateCardProps {
  template: InstagramTemplate;
  onSelect: (template: InstagramTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      "urgency": "bg-red-100 text-red-700 border-red-200",
      "personal-branding": "bg-purple-100 text-purple-700 border-purple-200",
      "e-commerce": "bg-green-100 text-green-700 border-green-200",
      "education": "bg-blue-100 text-blue-700 border-blue-200",
      "social": "bg-yellow-100 text-yellow-700 border-yellow-200"
    };
    
    return categoryColors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };
  
  const getCategoryEmoji = (category: string): string => {
    const categoryEmojis: Record<string, string> = {
      "urgency": "⏰",
      "personal-branding": "👤",
      "e-commerce": "🛍️",
      "education": "📚",
      "social": "💬"
    };
    
    return categoryEmojis[category] || "📋";
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all cursor-pointer border hover:border-primary hover:shadow-md",
        isHovering ? "ring-2 ring-primary" : ""
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => onSelect(template)}
    >
      <div className="relative">
        {template.thumbnailUrl ? (
          <div className="aspect-square bg-muted">
            <img 
              src={template.thumbnailUrl} 
              alt={template.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square bg-muted flex items-center justify-center">
            <span className="text-4xl">{getCategoryEmoji(template.category)}</span>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <span className={cn(
            "text-xs py-1 px-2 rounded-full font-medium border", 
            getCategoryColor(template.category)
          )}>
            {template.category}
          </span>
        </div>
      </div>
      
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-sm truncate">{template.name}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{template.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button 
          className="w-full" 
          size="sm" 
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template);
          }}
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};
