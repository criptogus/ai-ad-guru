
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";

export interface AdTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  format?: "feed" | "story" | "reel";
  tags?: string[];
}

interface TemplateGalleryProps {
  templates: AdTemplate[];
  onSelect: (template: AdTemplate) => void;
  selectedTemplateId?: string;
  title?: string;
  displayMode?: "grid" | "horizontal" | "vertical";
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  templates,
  onSelect,
  selectedTemplateId,
  title = "Template Gallery",
  displayMode = "grid"
}) => {
  if (!templates || templates.length === 0) {
    return <div className="text-center p-4 text-gray-500">No templates available</div>;
  }

  const containerClass = 
    displayMode === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
      : displayMode === "horizontal" 
        ? "flex flex-nowrap gap-4 pb-2 overflow-x-auto" 
        : "flex flex-col gap-4";

  const cardClass = displayMode === "horizontal" ? "min-w-[220px]" : "";

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      
      <ScrollArea className={displayMode === "horizontal" ? "w-full" : ""}>
        <div className={containerClass}>
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-shadow hover:shadow-md ${cardClass} ${
                selectedTemplateId === template.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(template)}
            >
              <CardContent className="p-4">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{template.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.tags?.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.format && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">
                      {template.format}
                    </span>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template);
                  }}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TemplateGallery;
