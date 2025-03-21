
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BannerTemplate } from "./SmartBannerBuilder";

interface TemplateSelectionProps {
  templates: BannerTemplate[];
  onSelectTemplate: (template: BannerTemplate) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Choose a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img 
                src={template.previewImageUrl} 
                alt={template.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => onSelectTemplate(template)} 
                className="w-full"
              >
                Use This Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelection;
