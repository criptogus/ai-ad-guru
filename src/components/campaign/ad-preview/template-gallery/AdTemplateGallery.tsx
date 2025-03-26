
import React from "react";
import { AdTemplate } from "./TemplateGallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface AdTemplateGalleryProps {
  templates: AdTemplate[];
  onTemplateSelect: (template: AdTemplate) => void;
  className?: string;
}

const AdTemplateGallery: React.FC<AdTemplateGalleryProps> = ({
  templates,
  onTemplateSelect,
  className = ""
}) => {
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  
  // Get unique categories from templates
  const categories = Array.from(
    new Set(templates.map((template) => template.category))
  );
  
  // Filter templates by category
  const filteredTemplates = activeCategory === "all"
    ? templates
    : templates.filter((template) => template.category === activeCategory);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, 1fr)` }}>
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            className="group flex flex-col items-center p-2 border rounded-lg hover:border-blue-500 hover:-translate-y-0.5 transition-all"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-2">
              {/* We'll just display a placeholder since the template doesn't have thumbnail property */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {template.name.charAt(0)}
              </div>
            </div>
            <span className="text-sm font-medium group-hover:text-blue-500">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdTemplateGallery;
