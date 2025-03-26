
import React, { useState } from "react";
import { TriggerButtonInline } from "@/components/campaign/ad-preview/TriggerButtonInline";
import CategoryFilter from "./CategoryFilter";
import CategoryTemplateGrid from "./CategoryTemplateGrid";
import FilteredTemplateGrid from "./FilteredTemplateGrid";
import { templates, categories } from "./templateData";

export interface InstagramTemplate {
  id: string;
  title: string;
  category: string;
  prompt: string;
  hasVariables?: boolean;
}

interface InstagramTemplateGalleryProps {
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const InstagramTemplateGallery: React.FC<InstagramTemplateGalleryProps> = ({ onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  // Filter templates based on active category
  const filteredTemplates = activeCategory === "all" 
    ? templates 
    : templates.filter(template => template.category === activeCategory);
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Instagram Ad Templates</h3>
        <TriggerButtonInline 
          onInsert={() => {}} 
          className="opacity-0 pointer-events-none" 
        />
      </div>
      
      <CategoryFilter 
        categories={categories} 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
      />
      
      {filteredTemplates.length > 0 && (
        <div className="space-y-12">
          {activeCategory !== "all" ? (
            <FilteredTemplateGrid 
              templates={filteredTemplates} 
              onSelectTemplate={onSelectTemplate} 
            />
          ) : (
            <>
              {categories.map((category) => {
                const categoryTemplates = templates.filter(t => t.category === category.id);
                
                if (categoryTemplates.length === 0) return null;
                
                return (
                  <CategoryTemplateGrid
                    key={category.id}
                    categoryId={category.id}
                    categoryName={category.name}
                    categoryEmoji={category.emoji}
                    templates={categoryTemplates}
                    onSelectTemplate={onSelectTemplate}
                  />
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InstagramTemplateGallery;
