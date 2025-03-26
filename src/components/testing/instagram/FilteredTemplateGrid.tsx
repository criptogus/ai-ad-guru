
import React from "react";
import { TemplateCard } from "./TemplateCard";
import { InstagramTemplate } from "./InstagramTemplateGallery";

interface FilteredTemplateGridProps {
  templates: InstagramTemplate[];
  onSelectTemplate: (template: InstagramTemplate) => void;
}

const FilteredTemplateGrid: React.FC<FilteredTemplateGridProps> = ({
  templates,
  onSelectTemplate
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
