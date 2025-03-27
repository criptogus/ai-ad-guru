
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdvancedPromptTemplatesProps {
  onSelectPrompt: (prompt: string) => void;
}

const promptTemplates = [
  {
    id: "instagram-lifestyle",
    title: "Instagram Lifestyle",
    prompt: "Create a modern, aspirational Instagram lifestyle photo showing a person using a product naturally in a well-lit, minimalist home environment. Use soft natural lighting, neutral tones, and a shallow depth of field for a professional look."
  },
  {
    id: "instagram-product",
    title: "Instagram Product Showcase",
    prompt: "Create a minimalist product photo for Instagram with a single product as the hero against a simple, clean background. Use soft shadows, crisp details, and perfect lighting to highlight product features. Style: professional, modern e-commerce."
  },
  {
    id: "instagram-storytelling",
    title: "Instagram Storytelling",
    prompt: "Generate an Instagram image that tells a brand origin story. Show vintage/historical elements mixed with modern outcomes, use a narrative-driven composition, and add subtle text overlays if needed. Style: authentic, emotional, journey-focused."
  },
  {
    id: "advanced-ad",
    title: "Advanced AI-Powered Ad",
    prompt: "Create a high-impact advertising image that combines cutting-edge AI aesthetics with emotional resonance. Show the product/service creating a transformative moment for the user, with visible before/after elements. Include subtle visual cues that suggest technological advancement without being too sci-fi. Lighting should be dramatic yet natural, with a color palette that evokes trust and innovation."
  },
  {
    id: "professional-testimonial",
    title: "Professional Testimonial",
    prompt: "Design a sophisticated testimonial image featuring a professional environment. Include a clean quote overlay on a business context background. Style should be corporate yet approachable, with careful attention to typography hierarchy and readability. Avoid stock photo clichés and aim for authenticity."
  }
];

const AdvancedPromptTemplates: React.FC<AdvancedPromptTemplatesProps> = ({ onSelectPrompt }) => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select from these professional ad prompt templates to generate high-quality images with AI. Each template is designed to produce visually appealing and effective ad creative.
      </p>
      
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {promptTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  {template.prompt.length > 120 
                    ? `${template.prompt.substring(0, 120)}...` 
                    : template.prompt}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onSelectPrompt(template.prompt)}
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AdvancedPromptTemplates;
