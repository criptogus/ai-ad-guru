
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface InstagramTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  imagePrompt: string;
  thumbnailUrl?: string; // Add the thumbnailUrl property as optional
}

interface InstagramTemplateCardProps {
  template: InstagramTemplate;
  onSelect: (template: InstagramTemplate) => void;
}

const InstagramTemplateCard: React.FC<InstagramTemplateCardProps> = ({ template, onSelect }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium">{template.name}</h3>
          <p className="text-xs text-muted-foreground">{template.description}</p>
          <div className="flex justify-between items-center">
            <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
              {template.category}
            </span>
            <Button variant="default" size="sm" onClick={() => onSelect(template)}>
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const templates: InstagramTemplate[] = [
  {
    id: "urgency",
    name: "Limited Time Offer",
    description: "Create urgency with a time-sensitive promotion",
    category: "urgency",
    imagePrompt: "Create a high-quality professional image showing a limited time offer with a countdown clock or timer. Use ${mainText:Limited Time Only!} as the main message displayed prominently."
  },
  {
    id: "personal-branding",
    name: "Personal Brand Spotlight",
    description: "Showcase your personal brand with a professional image",
    category: "personal-branding",
    imagePrompt: "Generate a professional headshot-style image for personal branding with clean background, professional lighting, and ${mainText:Your Professional Journey} as a concept."
  },
  {
    id: "e-commerce",
    name: "Product Showcase",
    description: "Highlight a product with premium photography",
    category: "e-commerce",
    imagePrompt: "Create a premium product photography style image with professional lighting, minimalist background, and ${mainText:Quality Product} as the focus. Style should be clean and modern."
  },
  {
    id: "education",
    name: "Educational Content",
    description: "Share knowledge with an educational theme",
    category: "education",
    imagePrompt: "Generate an educational themed image with visual elements like books, digital learning, or classroom setting. Incorporate ${mainText:Learn Something New} as a concept."
  },
  {
    id: "social",
    name: "Community Connection",
    description: "Build community with engaging social content",
    category: "social",
    imagePrompt: "Create a vibrant social community themed image showing people connecting, sharing, or engaging. Include ${mainText:Join Our Community} as the visual concept."
  }
];

interface InstagramTemplateGalleryProps {
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const InstagramTemplateGallery: React.FC<InstagramTemplateGalleryProps> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Instagram Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <InstagramTemplateCard
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default InstagramTemplateGallery;
