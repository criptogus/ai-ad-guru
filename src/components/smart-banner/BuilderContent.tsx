
import React from "react";
import TemplateSelection from "./TemplateSelection";
import BannerEditor from "./BannerEditor";
import BannerPreview from "./BannerPreview";
import ExportOptions from "./ExportOptions";
import { BannerTemplate, BannerFormat, BannerPlatform } from "./types";
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BannerEditor 
            template={selectedTemplate}
            format={selectedFormat}
            platform={selectedPlatform}
            backgroundImage={backgroundImage}
            textElements={textElements}
            onUpdateTextElement={onUpdateTextElement}
            onGenerateAIImage={onGenerateAIImage}
            onRegenerateImage={onRegenerateImage}
            onGenerateAIText={onGenerateAIText}
            onUploadImage={onUploadImage}
            isGeneratingImage={isGeneratingImage}
            isUploading={isUploading}
            onGoToExport={onGoToExport}
            bannerElements={bannerElements}
            onUpdateBannerElements={onUpdateBannerElements}
            userImages={userImages}
            onSelectUserImage={onSelectUserImage}
          />
        </div>
        <div className="lg:col-span-1">
          <BannerPreview
            format={selectedFormat}
            platform={selectedPlatform}
            backgroundImage={backgroundImage}
            textElements={textElements}
            bannerElements={bannerElements}
          />
        </div>
      </div>
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
