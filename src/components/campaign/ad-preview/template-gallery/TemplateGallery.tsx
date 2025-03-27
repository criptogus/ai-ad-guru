
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface AdDimensions {
  width: number;
  height: number;
}

export interface AdTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  platform: string;
  dimensions?: AdDimensions;
  thumbnail?: string;
}

const TEMPLATE_CATEGORIES = [
  { id: "all", name: "All Templates" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "product", name: "Product" },
  { id: "brand", name: "Brand" },
  { id: "promotion", name: "Promotion" },
];

// Mock templates
const MOCK_TEMPLATES: AdTemplate[] = [
  {
    id: "instagram-lifestyle-1",
    name: "Lifestyle Moment",
    description: "Show your product in an authentic lifestyle context",
    prompt: "Create a stylish lifestyle Instagram image showing people using a product in an authentic everyday setting. Natural lighting, soft focus background, candid feel.",
    category: "lifestyle",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 },
    thumbnail: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
  },
  {
    id: "instagram-product-1",
    name: "Product Spotlight",
    description: "Highlight your product with a clean, minimal background",
    prompt: "Create a professional product photography image for Instagram. Clean minimal background, perfect lighting, high detail, commercial quality.",
    category: "product",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 },
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop"
  },
  {
    id: "instagram-brand-1",
    name: "Brand Identity",
    description: "Showcase your brand identity and values",
    prompt: "Create a stylish brand-focused Instagram image that conveys brand values and identity. Modern aesthetic, on-brand colors, conceptual approach.",
    category: "brand",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 },
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop"
  },
  {
    id: "instagram-promotion-1",
    name: "Sale Announcement",
    description: "Announce a sale or special promotion",
    prompt: "Create an eye-catching Instagram promotion image for a sale or special offer. Vibrant colors, exciting composition, attention-grabbing elements.",
    category: "promotion",
    platform: "instagram",
    dimensions: { width: 1080, height: 1080 },
    thumbnail: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop"
  },
  {
    id: "instagram-story-1",
    name: "Story Moment",
    description: "Vertical image perfect for Instagram Stories",
    prompt: "Create a vertical Instagram story image with dynamic composition and room for text overlay. Engaging visual with emotional impact.",
    category: "lifestyle",
    platform: "instagram",
    dimensions: { width: 1080, height: 1920 },
    thumbnail: "https://images.unsplash.com/photo-1534103362078-d07e750bd0c4?w=800&auto=format&fit=crop"
  },
];

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
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter templates by platform
  const platformTemplates = MOCK_TEMPLATES.filter(t => t.platform === platform);
  
  // Filter templates by category and search query
  const filteredTemplates = platformTemplates.filter(template => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Template Gallery</DialogTitle>
          <DialogDescription>
            Choose a template to generate your ad image
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center border rounded-md px-3 py-2 mb-4">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <Input 
            placeholder="Search templates..." 
            className="border-0 p-0 focus-visible:ring-0 focus-visible:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            {TEMPLATE_CATEGORIES.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="overflow-y-auto flex-1 pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  className="cursor-pointer group border rounded-md overflow-hidden hover:border-primary transition-all"
                  onClick={() => {
                    onSelectTemplate(template);
                    onClose();
                  }}
                >
                  <div className="aspect-square bg-muted relative">
                    {template.thumbnail ? (
                      <img 
                        src={template.thumbnail} 
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                        <span className="text-muted-foreground">No preview</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">
                        Select
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No templates found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or category filter
                </p>
              </div>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;
