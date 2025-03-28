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
    
    if (template.imagePrompt) {
      const mainTextMatch = template.imagePrompt.match(/\${mainText:([^}]*)}/);
      
      if (mainTextMatch && mainTextMatch[1]) {
        setMainText(mainTextMatch[1]);
      }
      
      onAdChange("imagePrompt", template.imagePrompt);
    }
    
    const categoryAdDetails = getCategoryAdDetails(template.category);
    onAdChange("headline", categoryAdDetails.headline);
    onAdChange("primaryText", categoryAdDetails.primaryText);
    onAdChange("description", categoryAdDetails.description);
    
    setActiveTab("form");
  };

  const getCategoryAdDetails = (category: string): { headline: string; primaryText: string; description: string } => {
    const adDetailsMap: Record<string, { headline: string; primaryText: string; description: string }> = {
      "urgency": {
        headline: "Limited Time Offer Inside! 🔥",
        primaryText: "Don't miss out on our exclusive deals! Only available for a short time. Act now before these amazing offers expire.",
        description: "Shop Now"
      },
      "personal-branding": {
        headline: "Elevate Your Personal Brand 👤",
        primaryText: "Stand out from the crowd with our professional solutions designed to showcase your unique skills and talents.",
        description: "Learn More"
      },
      "e-commerce": {
        headline: "Discover Our New Collection 🛍️",
        primaryText: "Explore our latest products, crafted with care and designed for style and functionality. Perfect for your everyday needs.",
        description: "Shop Collection"
      },
      "education": {
        headline: "Master New Skills Today 📚",
        primaryText: "Unlock your potential with our expert-led courses. Learn at your own pace and transform your career prospects.",
        description: "Enroll Now"
      },
      "social": {
        headline: "Join Our Community 💬",
        primaryText: "Connect with like-minded people and be part of something special. Share experiences and grow together.",
        description: "Join Now"
      }
    };
    
    return adDetailsMap[category] || {
      headline: "Discover Our New Product",
      primaryText: "Transform your daily routine with our innovative solution. Designed for maximum efficiency and built to last.",
      description: "Learn More"
    };
  };

  const handleGenerateWithTemplate = async () => {
    if (selectedTemplate) {
      let processedPrompt = selectedTemplate.imagePrompt || "";
      
      if (mainText && processedPrompt) {
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
