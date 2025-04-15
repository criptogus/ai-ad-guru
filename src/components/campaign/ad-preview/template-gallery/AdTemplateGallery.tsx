
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import adTemplates, { getTemplatesByPlatform } from "./adTemplateData";
import { AdTemplate } from "./TemplateGallery";

interface AdTemplateGalleryProps {
  onSelectTemplate: (template: AdTemplate) => void;
  isOpen: boolean;
  onClose: () => void;
  platform?: string;
}

const AdTemplateGallery: React.FC<AdTemplateGalleryProps> = ({
  onSelectTemplate,
  isOpen,
  onClose,
  platform = "instagram"
}) => {
  // Get platform-specific templates
  const templates = getTemplatesByPlatform(platform);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {platform.charAt(0).toUpperCase() + platform.slice(1)} Ad Templates
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto py-4">
          <ScrollArea className="h-[60vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => onSelectTemplate(template)}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdTemplateGallery;
