
import React from "react";
import { TemplateCard } from "./TemplateCard";
import { InstagramTemplate } from "./InstagramTemplateGallery";

interface CategoryTemplateGridProps {
  categoryId: string;
  categoryName: string;
  categoryEmoji: string;
  templates: InstagramTemplate[];
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const CategoryTemplateGrid: React.FC<CategoryTemplateGridProps> = ({
  categoryId,
  categoryName,
  categoryEmoji,
  templates,
  onSelectTemplate
}) => {
  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center gap-2">
        <h4 className="text-lg font-medium flex items-center">
          <span className="mr-2">{categoryEmoji}</span>
          {categoryName}
        </h4>
        <div className="h-px flex-1 bg-border"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map((template) => (
          <TemplateCard 
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryTemplateGrid;
