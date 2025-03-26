
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { templateCategories, adTemplates, AdTemplate } from "./adTemplateData";

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AdTemplate) => void;
  platform?: string;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  platform = "instagram"
}) => {
  const [activeCategory, setActiveCategory] = useState(templateCategories[0]?.id || "");

  // Filter templates based on platform if needed
  const filteredTemplates = platform 
    ? adTemplates.filter(template => !template.category.includes("linkedin") || platform === "linkedin")
    : adTemplates;

  const handleSelectTemplate = (template: AdTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  const getTemplatesForCategory = (categoryId: string) => {
    return filteredTemplates.filter(template => template.category === categoryId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>🎯 Ad Template Prompt Gallery</DialogTitle>
          <DialogDescription>
            Select a template to generate professional ad images with ChatGPT-4o. Each template is optimized for specific marketing goals.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid" style={{ gridTemplateColumns: `repeat(${templateCategories.length < 5 ? templateCategories.length : 5}, 1fr)` }}>
            {templateCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                <span>{category.emoji}</span>
                <span className="hidden md:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {templateCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="flex-1 overflow-hidden">
              <div className="mb-4">
                <Badge className={category.color}>
                  {category.emoji} {category.name}
                </Badge>
              </div>
              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-4">
                  {getTemplatesForCategory(category.id).map((template) => (
                    <Card key={template.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{template.name}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSelectTemplate(template)}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Use Template</span>
                          </Button>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          <div className="border rounded-md p-3 bg-muted/30 whitespace-pre-wrap">
                            {template.prompt}
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-3" 
                          onClick={() => handleSelectTemplate(template)}
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;
export type { AdTemplate };
