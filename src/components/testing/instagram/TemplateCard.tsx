
import React from "react";
import { InstagramTemplate } from "./InstagramTemplateGallery";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TemplateCardProps {
  template: InstagramTemplate;
  onSelect: (template: InstagramTemplate) => void;
  isSelected?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onSelect,
  isSelected = false
}) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : "hover:border-primary"
      }`}
      onClick={() => onSelect(template)}
    >
      <div className="aspect-square bg-muted/20 flex items-center justify-center text-4xl">
        {/* Placeholder for template preview image */}
        <span className="opacity-60">{template.category.charAt(0)}</span>
      </div>
      
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm">{template.title}</h3>
            <div className="text-xs text-muted-foreground capitalize">
              {template.category}
            </div>
          </div>
          
          <div className="flex gap-1">
            {isSelected && <Check className="h-4 w-4 text-primary" />}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Info className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs max-w-[200px]">{template.prompt}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
