
import React from "react";
import { InstagramTemplate } from "./InstagramTemplateGallery";
import { TemplateCard } from "./TemplateCard";

interface FilteredTemplateGridProps {
  templates: InstagramTemplate[];
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const FilteredTemplateGrid: React.FC<FilteredTemplateGridProps> = ({ templates, onSelectTemplate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard 
          key={template.id} 
          template={template} 
          onSelect={onSelectTemplate}
        />
      ))}
    </div>
  );
};

export default FilteredTemplateGrid;
