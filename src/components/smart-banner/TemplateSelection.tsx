
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BannerTemplate } from "./SmartBannerBuilder";

interface TemplateSelectionProps {
  templates: BannerTemplate[];
  onSelectTemplate: (template: BannerTemplate) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ templates, onSelectTemplate }) => {
  // Group templates by type
  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = [];
    }
    acc[template.type].push(template);
    return acc;
  }, {} as Record<string, BannerTemplate[]>);

  // Get readable type name
  const getTypeName = (type: string): string => {
    switch (type) {
      case "product": return "Product Templates";
      case "seasonal": return "Seasonal Promotions";
      case "event": return "Event Announcements";
      case "brand": return "Brand Awareness";
      case "discount": return "Sale & Discount";
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  // Get badge color based on template type
  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "product": return "default";
      case "seasonal": return "secondary";
      case "event": return "outline";
      case "brand": return "default";
      case "discount": return "destructive";
      default: return "outline";
    }
  };

  // Get template description based on template id
  const getTemplateDescription = (template: BannerTemplate): string => {
    if (template.id === "webinar-event") {
      return "Professional layout for promoting webinars and online events";
    } else if (template.id === "holiday-special") {
      return "Festive design for holiday season promotions and special offers";
    } else if (template.id === "flash-sale") {
      return "Attention-grabbing design for time-limited promotions";
    }
    return template.description;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Choose a Template</h2>
      
      {Object.keys(groupedTemplates).map((type) => (
        <div key={type} className="mb-10">
          <h3 className="text-xl font-semibold mb-4">{getTypeName(type)}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedTemplates[type].map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  <img 
                    src={template.previewImageUrl} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={getBadgeVariant(template.type)}>
                      {template.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{getTemplateDescription(template)}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
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
      ))}
    </div>
  );
};

export default TemplateSelection;
