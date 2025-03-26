
import React from "react";
import { useTriggerData } from "./useTriggerData";
import { Button } from "@/components/ui/button";

interface TemplateExamplesProps {
  platform: string;
  onSelectTemplate?: (template: string) => void; // Add callback prop
}

const TemplateExamples: React.FC<TemplateExamplesProps> = ({ 
  platform,
  onSelectTemplate
}) => {
  const { getPlatformTemplates } = useTriggerData();
  
  return (
    <div className="mt-4">
      <h3 className="text-md font-medium mb-2">Template Examples</h3>
      <div className="bg-muted p-3 rounded-md space-y-2">
        {getPlatformTemplates(platform).map((template, idx) => (
          <Button 
            key={idx} 
            variant="ghost"
            className="p-2 w-full h-auto justify-start font-normal text-left whitespace-normal"
            onClick={() => {
              if (onSelectTemplate) {
                onSelectTemplate(template);
              }
            }}
          >
            {template}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Click any template to use it as your custom prompt
      </p>
    </div>
  );
};

export default TemplateExamples;
