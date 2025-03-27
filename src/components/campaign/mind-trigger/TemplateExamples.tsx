
import React from "react";
import { useTriggerData } from "./useTriggerData";

interface TemplateExamplesProps {
  platform: string;
  onSelectTemplate: (template: string) => void;
}

const TemplateExamples: React.FC<TemplateExamplesProps> = ({ platform, onSelectTemplate }) => {
  const { getPlatformTemplates } = useTriggerData();

  const handleTemplateClick = (e: React.MouseEvent, template: string) => {
    e.preventDefault(); // Prevent any form submission
    onSelectTemplate(template);
  };

  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Template Examples</h3>
      <div className="bg-muted p-3 rounded-md space-y-2">
        {getPlatformTemplates(platform).map((template, idx) => (
          <div 
            key={idx} 
            className="p-2 bg-background rounded border cursor-pointer hover:border-primary transition-colors"
            onClick={(e) => handleTemplateClick(e, template)}
          >
            {template}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Click any template to use it as your custom prompt
      </p>
    </div>
  );
};

export default TemplateExamples;
