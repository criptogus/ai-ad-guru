
import React from "react";
import { BannerTemplate, BannerFormat, BannerPlatform } from "./types";
import TemplateSelection from "./TemplateSelection";
import BannerEditor from "./editor/BannerEditor";
import ExportOptions from "./export/ExportOptions";
import { BannerElement, TextElement } from "@/hooks/smart-banner/types";

interface BuilderContentProps {
  currentStep: "template" | "editor" | "export";
  selectedTemplate: BannerTemplate | null;
  selectedFormat: BannerFormat;
  selectedPlatform: BannerPlatform;
  templates: BannerTemplate[];
  backgroundImage: string | null;
  textElements: TextElement[];
  bannerElements: BannerElement[];
  userImages: string[];
  isGeneratingImage: boolean;
  isUploading: boolean;
  onTemplateSelect: (template: BannerTemplate) => void;
  onGoToExport: () => void;
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onGenerateAIImage: (prompt: string) => Promise<void>;
  onRegenerateImage: () => Promise<void>;
  onGenerateAIText: (elementId: string, type: "headline" | "subheadline" | "cta") => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  onSelectUserImage: (imageUrl: string) => void;
  onUpdateBannerElements: (elements: BannerElement[]) => void;
  onBack: () => void;
}

const BuilderContent: React.FC<BuilderContentProps> = ({
  currentStep,
  selectedTemplate,
  selectedFormat,
  selectedPlatform,
  templates,
  backgroundImage,
  textElements,
  bannerElements,
  userImages,
  isGeneratingImage,
  isUploading,
  onTemplateSelect,
  onGoToExport,
  onUpdateTextElement,
  onGenerateAIImage,
  onRegenerateImage,
  onGenerateAIText,
  onUploadImage,
  onSelectUserImage,
  onUpdateBannerElements,
  onBack
}) => {
  if (currentStep === "template") {
    return (
      <TemplateSelection 
        templates={templates} 
        onSelectTemplate={onTemplateSelect} 
      />
    );
  }

  if (currentStep === "editor" && selectedTemplate) {
    return (
      <BannerEditor 
        template={selectedTemplate}
        format={selectedFormat}
        platform={selectedPlatform}
        backgroundImage={backgroundImage}
        textElements={textElements}
        bannerElements={bannerElements}
        userImages={userImages}
        onUpdateTextElement={onUpdateTextElement}
        onGenerateAIImage={onGenerateAIImage}
        onRegenerateImage={onRegenerateImage}
        onGenerateAIText={onGenerateAIText}
        onUploadImage={onUploadImage}
        onSelectUserImage={onSelectUserImage}
        isGeneratingImage={isGeneratingImage}
        isUploading={isUploading}
        onGoToExport={onGoToExport}
        onUpdateBannerElements={onUpdateBannerElements}
      />
    );
  }

  if (currentStep === "export") {
    return (
      <ExportOptions
        format={selectedFormat}
        platform={selectedPlatform}
        backgroundImage={backgroundImage}
        textElements={textElements}
        bannerElements={bannerElements}
        onBack={onBack}
      />
    );
  }

  return null;
};

export default BuilderContent;
