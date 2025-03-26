
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InstagramTemplateGallery, { InstagramTemplate } from "../instagram/InstagramTemplateGallery";
import AdFormFields from "./AdFormFields";
import ImagePromptField from "./ImagePromptField";
import TemplateVariablesForm from "./TemplateVariablesForm";
import AdFormActions from "./AdFormActions";

interface NewMetaAdFormProps {
  testAd: MetaAd;
  companyInfo: WebsiteAnalysisResult;
  industry: string;
  adTheme: string;
  imageFormat: string;
  isGenerating: boolean;
  onCompanyNameChange: (value: string) => void;
  onAdChange: (field: keyof MetaAd, value: string) => void;
  onIndustryChange: (value: string) => void;
  onAdThemeChange: (value: string) => void;
  onImageFormatChange: (value: string) => void;
  onGenerateImage: () => Promise<void>;
  onReset: () => void;
}

const NewMetaAdForm: React.FC<NewMetaAdFormProps> = ({
  testAd,
  companyInfo,
  industry,
  adTheme,
  imageFormat,
  isGenerating,
  onCompanyNameChange,
  onAdChange,
  onIndustryChange,
  onAdThemeChange,
  onImageFormatChange,
  onGenerateImage,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState("form");
  const [selectedTemplate, setSelectedTemplate] = useState<InstagramTemplate | null>(null);
  const [mainText, setMainText] = useState("");

  const handleSelectTemplate = (template: InstagramTemplate) => {
    setSelectedTemplate(template);
    
    const mainTextMatch = template.prompt.match(/\${mainText:([^}]*)}/);
    
    if (mainTextMatch && mainTextMatch[1]) {
      setMainText(mainTextMatch[1]);
    }
    
    onAdChange("imagePrompt", template.prompt);
    setActiveTab("form");
  };

  const handleGenerateWithTemplate = async () => {
    if (selectedTemplate) {
      let processedPrompt = selectedTemplate.prompt;
      
      if (mainText) {
        processedPrompt = processedPrompt.replace(/\${mainText:[^}]*}/g, mainText);
      }
      
      onAdChange("imagePrompt", processedPrompt);
      await onGenerateImage();
    } else {
      await onGenerateImage();
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="form">Ad Details</TabsTrigger>
        <TabsTrigger value="templates">Template Gallery</TabsTrigger>
      </TabsList>

      <TabsContent value="form">
        <Card>
          <CardContent className="p-4 pt-5 space-y-4">
            <AdFormFields
              testAd={testAd}
              companyInfo={companyInfo}
              industry={industry}
              adTheme={adTheme}
              imageFormat={imageFormat}
              onCompanyNameChange={onCompanyNameChange}
              onAdChange={onAdChange}
              onIndustryChange={onIndustryChange}
              onAdThemeChange={onAdThemeChange}
              onImageFormatChange={onImageFormatChange}
            />

            {selectedTemplate ? (
              <TemplateVariablesForm
                selectedTemplate={selectedTemplate}
                mainText={mainText}
                setMainText={setMainText}
              />
            ) : (
              <ImagePromptField
                testAd={testAd}
                onAdChange={onAdChange}
              />
            )}

            <AdFormActions
              isGenerating={isGenerating}
              hasPromptContent={!!testAd.imagePrompt || !!selectedTemplate}
              onGenerate={handleGenerateWithTemplate}
              onReset={onReset}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates">
        <Card>
          <CardContent className="p-4">
            <InstagramTemplateGallery onSelectTemplate={handleSelectTemplate} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default NewMetaAdForm;
