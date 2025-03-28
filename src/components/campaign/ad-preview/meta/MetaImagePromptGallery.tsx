
import React from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MetaImagePromptGalleryProps {
  initialPrompt: string;
  onSelectPrompt: (prompt: string) => void;
  displayMode?: "vertical" | "horizontal";
}

const MetaImagePromptGallery: React.FC<MetaImagePromptGalleryProps> = ({ 
  initialPrompt, 
  onSelectPrompt,
  displayMode = "vertical"
}) => {
  const promptTemplates = [
    {
      id: "product",
      name: "Product Showcase",
      prompt: "Professional product photo on a clean minimalist background, high quality, studio lighting, 8k resolution.",
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      prompt: "Lifestyle image showing a happy person using the product in a real-world scenario, bright natural lighting, high quality.",
    },
    {
      id: "testimonial",
      name: "Testimonial",
      prompt: "Professional headshot of a satisfied customer with a clean background, warm smile, high quality photo.",
    },
    {
      id: "before-after",
      name: "Before & After",
      prompt: "Split screen image showing before and after results, high quality comparison, clean layout.",
    },
    {
      id: "seasonal",
      name: "Seasonal",
      prompt: "Product displayed in a seasonal setting with thematic elements, celebratory mood, high quality photo.",
    },
    {
      id: "emoji",
      name: "Emoji Style",
      prompt: "Bright colorful image with fun emoji style elements, eye-catching design for social media, high quality.",
    },
  ];

  const isSelected = (prompt: string) => {
    return initialPrompt === prompt;
  };

  // Decide on the container class based on display mode
  const containerClass = displayMode === "horizontal"
    ? "flex flex-row gap-2"
    : "grid grid-cols-2 gap-2";

  // Decide on the button class based on display mode
  const buttonClass = displayMode === "horizontal"
    ? "min-w-32 h-auto flex flex-col items-center text-center py-2"
    : "h-auto flex flex-col items-center text-center py-2";

  return (
    <div className={containerClass}>
      {promptTemplates.map((template) => (
        <Button
          key={template.id}
          variant={isSelected(template.prompt) ? "default" : "outline"}
          className={buttonClass}
          onClick={() => onSelectPrompt(template.prompt)}
        >
          <span className="font-medium text-xs">{template.name}</span>
          {isSelected(template.prompt) && (
            <Check className="h-3 w-3 mt-1" />
          )}
        </Button>
      ))}
    </div>
  );
};

export default MetaImagePromptGallery;
