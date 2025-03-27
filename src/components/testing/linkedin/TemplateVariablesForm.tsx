
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PromptTemplate } from "@/hooks/template/usePromptTemplates";
import { Controller, useFormContext } from "react-hook-form";

interface TemplateVariablesFormProps {
  selectedTemplate: PromptTemplate;
  mainText: string;
  subText: string;
  setMainText: (value: string) => void;
  setSubText: (value: string) => void;
}

const TemplateVariablesForm: React.FC<TemplateVariablesFormProps> = ({
  selectedTemplate,
  mainText,
  subText,
  setMainText,
  setSubText
}) => {
  const { control } = useFormContext();
  
  const hasMainText = selectedTemplate.prompt_text.includes("${mainText");
  const hasSubText = selectedTemplate.prompt_text.includes("${subText");

  if (!hasMainText && !hasSubText) {
    return null;
  }

  return (
    <div className="space-y-4 border p-4 rounded-md bg-muted/20">
      <h3 className="text-sm font-medium">Template Variables</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Customize the template with your specific content
      </p>

      {hasMainText && (
        <div>
          <Label htmlFor="mainText">Main Text</Label>
          <Controller
            name="mainText"
            control={control}
            defaultValue={mainText}
            render={({ field }) => (
              <Input
                id="mainText"
                placeholder="Enter main content..."
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  setMainText(e.target.value);
                }}
              />
            )}
          />
        </div>
      )}

      {hasSubText && (
        <div>
          <Label htmlFor="subText">Secondary Text</Label>
          <Controller
            name="subText"
            control={control}
            defaultValue={subText}
            render={({ field }) => (
              <Input
                id="subText"
                placeholder="Enter secondary content..."
                value={field.value}
                onChange={(e) => {
                  field.onChange(e);
                  setSubText(e.target.value);
                }}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};

export default TemplateVariablesForm;
