
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import CategoryFilter from "./CategoryFilter";
import FilteredTemplateGrid from "./FilteredTemplateGrid";

export interface InstagramTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  thumbnailUrl?: string;
  category: string;
}

interface InstagramTemplateGalleryProps {
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const InstagramTemplateGallery: React.FC<InstagramTemplateGalleryProps> = ({ onSelectTemplate }) => {
  // Sample templates - in a real app, these would come from an API
  const templates: InstagramTemplate[] = [
    {
      id: "template-1",
      name: "Limited Time Offer",
      description: "Create urgency with a time-limited promotion",
      prompt: "Create an eye-catching Instagram promotion with vibrant colors featuring a countdown timer effect. Show ${mainText:the special limited-time offer details here}. Use urgency-focused design with bold, attention-grabbing text.",
      thumbnailUrl: "https://placehold.co/300x300/FFC0CB/ffffff?text=Limited+Time",
      category: "urgency"
    },
    {
      id: "template-2",
      name: "Professional Branding",
      description: "Elegant template for personal brand building",
      prompt: "Design a sophisticated, minimal Instagram post with neutral tones suitable for a professional personal brand. Highlight ${mainText:your key professional achievement or offering}. Use clean typography and subtle visual elements.",
      thumbnailUrl: "https://placehold.co/300x300/E6E6FA/333333?text=Personal+Brand",
      category: "personal-branding"
    },
    {
      id: "template-3",
      name: "Product Showcase",
      description: "Highlight a product with clean, e-commerce focused design",
      prompt: "Create an Instagram product showcase with a clean white background. Feature ${mainText:product name and key benefit} prominently. Use modern, e-commerce style layout with clear call-to-action text.",
      thumbnailUrl: "https://placehold.co/300x300/F0F8FF/333333?text=Product",
      category: "e-commerce"
    },
    {
      id: "template-4",
      name: "Educational Content",
      description: "Perfect for sharing insights and teaching moments",
      prompt: "Design an educational Instagram graphic with a structured layout. Include ${mainText:your key learning point or tip} as the main focus. Use a teaching-friendly design with organized visual hierarchy and information flow.",
      thumbnailUrl: "https://placehold.co/300x300/E0FFFF/333333?text=Learn",
      category: "education"
    },
    {
      id: "template-5",
      name: "Social Proof",
      description: "Showcase testimonials and customer feedback",
      prompt: "Create an Instagram post highlighting social proof with a testimonial-focused design. Feature ${mainText:customer quote or review} prominently. Use a trustworthy, clean layout that emphasizes the customer's words.",
      thumbnailUrl: "https://placehold.co/300x300/FAFAD2/333333?text=Testimonial",
      category: "social"
    },
    {
      id: "template-6",
      name: "Flash Sale Alert",
      description: "High-energy design for flash sales and quick offers",
      prompt: "Design a high-energy, attention-grabbing Instagram post announcing a flash sale. Prominently display ${mainText:your sale details and time limit}. Use bright colors, bold typography, and urgency-inducing visual elements.",
      thumbnailUrl: "https://placehold.co/300x300/FF6347/ffffff?text=Flash+Sale",
      category: "urgency"
    },
    {
      id: "template-7",
      name: "Thought Leadership",
      description: "Position yourself as an industry expert",
      prompt: "Create a sophisticated Instagram post positioning the subject as a thought leader. Highlight ${mainText:your key insight or industry prediction}. Use a professional, authoritative design that conveys expertise and vision.",
      thumbnailUrl: "https://placehold.co/300x300/B0C4DE/ffffff?text=Thought+Leader",
      category: "personal-branding"
    },
    {
      id: "template-8",
      name: "New Collection Launch",
      description: "Announce your latest product collection",
      prompt: "Design an Instagram post announcing a new product collection. Feature ${mainText:your collection name and key highlight} as the focal point. Use an exciting, fresh design that conveys newness and exclusivity.",
      thumbnailUrl: "https://placehold.co/300x300/98FB98/333333?text=New+Collection",
      category: "e-commerce"
    }
  ];

  const categories = [
    { id: "urgency", name: "Urgency", emoji: "⏰" },
    { id: "personal-branding", name: "Personal Branding", emoji: "👤" },
    { id: "e-commerce", name: "E-commerce", emoji: "🛍️" },
    { id: "education", name: "Education", emoji: "📚" },
    { id: "social", name: "Social Proof", emoji: "💬" }
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredTemplates, setFilteredTemplates] = useState<InstagramTemplate[]>(templates);

  useEffect(() => {
    let result = templates;
    
    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter(template => template.category === activeCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(template => 
        template.name.toLowerCase().includes(query) || 
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredTemplates(result);
  }, [searchQuery, activeCategory]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Instagram Ad Templates</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Select a template to quickly create engaging Instagram ads. 
          Templates are organized by category and marketing objective.
        </p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search templates..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      
      <FilteredTemplateGrid
        templates={filteredTemplates}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
};

export default InstagramTemplateGallery;
