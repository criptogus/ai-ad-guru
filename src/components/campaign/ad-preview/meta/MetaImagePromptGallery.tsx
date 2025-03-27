
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Edit2, CheckCircle2, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ImagePromptTemplate {
  id: string;
  title: string;
  prompt: string;
  category: string;
  thumbnail?: string;
}

const imagePromptTemplates: ImagePromptTemplate[] = [
  {
    id: "professional",
    title: "Professional",
    category: "business",
    prompt: "Professional business setting with modern office, clean and corporate style, high-quality professional photography",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    category: "lifestyle",
    prompt: "Lifestyle image showing happy person using product in natural setting, warm lighting, authentic candid style",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
  },
  {
    id: "abstract",
    title: "Abstract",
    category: "abstract",
    prompt: "Abstract visual representation with brand colors, minimalist design, conceptual and artistic",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5"
  },
  {
    id: "product",
    title: "Product",
    category: "product",
    prompt: "Product-focused image with clean background, professional lighting, showcasing features and benefits",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
  },
  {
    id: "premium_card",
    title: "Premium Card Visual",
    category: "product",
    prompt: "Generate a photorealistic image of a hand holding a sleek fintech metal card with glowing edges, set against a modern urban skyline at dusk. Add a subtle green glow (color #10B981) to emphasize financial growth. Do not include text on image. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1559526324-593bc073d938"
  },
  {
    id: "testimonial",
    title: "Real User Story",
    category: "testimonial",
    prompt: "Create an image of a diverse young professional sitting in a bright café, smiling while checking their phone with financial graphs on screen. Suggest trust and satisfaction. Soft blur background. Photorealistic. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad"
  },
  {
    id: "urgency",
    title: "Limited Time Offer",
    category: "promo",
    prompt: "Design a dynamic image of a countdown timer overlaying digital money flow into a wallet. Neon blue and green lighting. Abstract tech background. Cinematic feel. Format: 1080x1350.",
    thumbnail: "https://images.unsplash.com/photo-1511376979163-f804dff7ad7b"
  },
  {
    id: "app_preview",
    title: "Mobile Interface Hero",
    category: "product",
    prompt: "Render a stylized 3D mockup of a mobile banking app screen showing a user's crypto balance and transaction feed. Floating UI panels. Light, high-contrast theme. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1617040619263-41c5a9ca7521"
  },
  {
    id: "team_culture",
    title: "Team Culture",
    category: "hiring",
    prompt: "Generate an image of a diverse tech team in a modern office, working together and laughing. Warm natural lighting. Corporate but friendly. Format: 1080x1080.",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const categories = ["all", "product", "lifestyle", "business", "promo", "testimonial", "hiring", "abstract"];
  
  const filteredTemplates = activeCategory === "all" 
    ? imagePromptTemplates 
    : imagePromptTemplates.filter(template => template.category === activeCategory);
  
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
        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-3">
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {categories.map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  size="sm"
                  className={`h-auto py-2 px-3 justify-start text-left ${
                    selectedTemplate === template.id 
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" 
                      : ""
                  }`}
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start">
                    {selectedTemplate === template.id && (
                      <CheckCircle2 className="h-3 w-3 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-xs">{template.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {template.prompt.length > 60 
                          ? template.prompt.substring(0, 60) + "..." 
                          : template.prompt}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="space-y-2">
              <div className="text-xs font-medium">Custom Image Prompt</div>
              <Input
                value={customPrompt}
                onChange={handleCustomPromptChange}
                placeholder="Enter a custom image prompt..."
                className="text-xs"
              />
              <Button 
                size="sm"
                onClick={handleApplyCustomPrompt}
                className="w-full"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Apply Custom Prompt
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MetaImagePromptGallery;
