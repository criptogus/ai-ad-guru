
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Edit2, CheckCircle2 } from "lucide-react";

interface ImagePromptTemplate {
  id: string;
  title: string;
  prompt: string;
  thumbnail?: string;
}

const imagePromptTemplates: ImagePromptTemplate[] = [
  {
    id: "professional",
    title: "Professional",
    prompt: "Professional business setting with modern office, clean and corporate style, high-quality professional photography",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    prompt: "Lifestyle image showing happy person using product in natural setting, warm lighting, authentic candid style",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: "abstract",
    title: "Abstract",
    prompt: "Abstract visual representation with brand colors, minimalist design, conceptual and artistic",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "product",
    title: "Product",
    prompt: "Product-focused image with clean background, professional lighting, showcasing features and benefits",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  }
];

interface MetaImagePromptGalleryProps {
  initialPrompt: string;
  onSelectPrompt: (prompt: string) => void;
}

const MetaImagePromptGallery: React.FC<MetaImagePromptGalleryProps> = ({
  initialPrompt,
  onSelectPrompt
}) => {
  const [customPrompt, setCustomPrompt] = useState(initialPrompt || "");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const handleSelectTemplate = (template: ImagePromptTemplate) => {
    setSelectedTemplate(template.id);
    setCustomPrompt(template.prompt);
    onSelectPrompt(template.prompt);
  };
  
  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPrompt(e.target.value);
  };
  
  const handleApplyCustomPrompt = () => {
    setSelectedTemplate(null);
    onSelectPrompt(customPrompt);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center">
          <Image className="h-4 w-4 mr-2" />
          Image Prompt Gallery
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {imagePromptTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                size="sm"
                className={`h-auto py-2 px-3 justify-start ${
                  selectedTemplate === template.id 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                    : ""
                }`}
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-center">
                  {selectedTemplate === template.id && (
                    <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500" />
                  )}
                  <span className="text-xs">{template.title}</span>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              value={customPrompt}
              onChange={handleCustomPromptChange}
              placeholder="Enter a custom image prompt..."
              className="text-xs"
            />
            <Button 
              size="sm"
              variant="outline"
              onClick={handleApplyCustomPrompt}
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaImagePromptGallery;
