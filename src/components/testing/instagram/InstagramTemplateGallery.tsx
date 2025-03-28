
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import FilteredTemplateGrid from "./FilteredTemplateGrid";

export interface InstagramTemplate {
  id: string;
  name: string;
  title?: string; // Add title property to support existing code
  description: string;
  category: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  format?: string;
  tags?: string[];
}

const CATEGORIES = [
  { id: "urgency", name: "Urgency", emoji: "⏰" },
  { id: "personal-branding", name: "Personal Branding", emoji: "👤" },
  { id: "e-commerce", name: "E-Commerce", emoji: "🛍️" },
  { id: "education", name: "Education", emoji: "📚" },
  { id: "social", name: "Social", emoji: "💬" }
];

const TEMPLATES: InstagramTemplate[] = [
  {
    id: "1",
    name: "Limited Time Offer",
    title: "Limited Time Offer", // Adding title that matches name
    description: "Create urgency with a time-sensitive promotion",
    category: "urgency",
    thumbnailUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d7f2a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["promotion", "sale", "discount"]
  },
  {
    id: "2",
    name: "Product Showcase",
    title: "Product Showcase", // Adding title that matches name
    description: "Highlight your product with an elegant display",
    category: "e-commerce",
    thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["product", "showcase", "feature"]
  },
  {
    id: "3",
    name: "Testimonial Spotlight",
    title: "Testimonial Spotlight", // Adding title that matches name
    description: "Share customer success stories",
    category: "social",
    thumbnailUrl: "https://images.unsplash.com/photo-1596434300655-e48d3ff3dd5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["testimonial", "review", "customer"]
  },
  {
    id: "4",
    name: "Expert Tips",
    title: "Expert Tips", // Adding title that matches name
    description: "Position yourself as an industry expert",
    category: "education",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["tips", "advice", "expertise"]
  },
  {
    id: "5",
    name: "Brand Story",
    title: "Brand Story", // Adding title that matches name
    description: "Share your brand's mission and values",
    category: "personal-branding",
    thumbnailUrl: "https://images.unsplash.com/photo-1493421419110-74f4e85ba126?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["story", "mission", "values"]
  },
  // Added more templates for better selection
  {
    id: "6",
    name: "Flash Sale",
    title: "Flash Sale", // Adding title that matches name
    description: "Create extreme urgency with flash sale",
    category: "urgency",
    thumbnailUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["flash", "sale", "discount"]
  },
  {
    id: "7",
    name: "Thought Leadership",
    title: "Thought Leadership", // Adding title that matches name
    description: "Establish authority with insights",
    category: "personal-branding",
    thumbnailUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["leadership", "insights", "authority"]
  },
  {
    id: "8",
    name: "Product Collection",
    title: "Product Collection", // Adding title that matches name
    description: "Showcase multiple products together",
    category: "e-commerce",
    thumbnailUrl: "https://images.unsplash.com/photo-1555529771-122e5d9f2341?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tags: ["collection", "products", "showcase"]
  }
];

interface InstagramTemplateGalleryProps {
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const InstagramTemplateGallery: React.FC<InstagramTemplateGalleryProps> = ({
  onSelectTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Instagram Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CategoryFilter 
          categories={CATEGORIES}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        <FilteredTemplateGrid 
          templates={filteredTemplates}
          onSelectTemplate={onSelectTemplate}
        />
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No templates match your search criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramTemplateGallery;
