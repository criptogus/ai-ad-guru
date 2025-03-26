
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";
import TemplateVariablesForm from "@/components/testing/meta/TemplateVariablesForm";

interface TemplateCustomizationFormProps {
  selectedTemplate: InstagramTemplate | null;
  mainText: string;
  setMainText: (text: string) => void;
  isGenerating: boolean;
  onGenerateImage: () => void;
  onReset: () => void;
}

const TemplateCustomizationForm: React.FC<TemplateCustomizationFormProps> = ({
  selectedTemplate,
  mainText,
  setMainText,
  isGenerating,
  onGenerateImage,
  onReset,
}) => {
  if (!selectedTemplate) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize & Generate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <TemplateVariablesForm
            selectedTemplate={selectedTemplate}
            mainText={mainText}
            setMainText={setMainText}
          />
          
          <div className="flex gap-3 pt-3">
            <Button 
              variant="outline" 
              onClick={onReset}
            >
              Reset
            </Button>
            <Button
              onClick={onGenerateImage}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Image"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateCustomizationForm;
