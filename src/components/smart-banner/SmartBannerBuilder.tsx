
import React, { useState } from "react";
import Header from "./Header";
import BannerSettings from "./BannerSettings";
import BuilderContent from "./BuilderContent";
import { BannerFormat, BannerPlatform, BannerTemplate } from "./types";
import { useBannerTemplate } from "@/hooks/smart-banner/useBannerTemplate";
import { useBannerEditor } from "@/hooks/smart-banner/useBannerEditor";
import { toast } from "sonner";

const SmartBannerBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<"template" | "editor" | "export">("template");
  const [selectedFormat, setSelectedFormat] = useState<BannerFormat>("square");
  const [selectedPlatform, setSelectedPlatform] = useState<BannerPlatform>("instagram");
  
  const { 
    selectedTemplate, 
    setSelectedTemplate,
    templates
  } = useBannerTemplate();
  
  const {
    bannerElements,
    setBannerElements,
    backgroundImage,
    setBackgroundImage,
    generateAIImage,
    isGeneratingImage,
    regenerateImage,
    textElements,
    updateTextElement,
    generateAIText,
    uploadImage,
    isUploading,
    userImages,
    selectUserImage
  } = useBannerEditor(selectedTemplate, selectedFormat, selectedPlatform);

  const handleTemplateSelect = (template: BannerTemplate) => {
    setSelectedTemplate(template);
    setCurrentStep("editor");
  };

  const handleGoToExport = () => {
    if (!backgroundImage) {
      toast.error("Please add a background image before exporting", {
        description: "You can generate an AI image or upload your own"
      });
      return;
    }
    setCurrentStep("export");
  };

  const handleFormatChange = (format: BannerFormat) => {
    setSelectedFormat(format);
  };

  const handlePlatformChange = (platform: BannerPlatform) => {
    setSelectedPlatform(platform);
  };

  const handleBackToEditor = () => {
    setCurrentStep("editor");
  };

  // Fix for the return type mismatch error - ensure regenerateImage returns void
  const handleRegenerateImage = async (): Promise<void> => {
    await regenerateImage();
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <Header 
        title="Smart Banner Builder" 
        description="Create professional ad banners with AI assistance" 
      />

      <BannerSettings 
        selectedFormat={selectedFormat}
        selectedPlatform={selectedPlatform}
        onFormatChange={handleFormatChange}
        onPlatformChange={handlePlatformChange}
      />

      <BuilderContent 
        currentStep={currentStep}
        selectedTemplate={selectedTemplate}
        selectedFormat={selectedFormat}
        selectedPlatform={selectedPlatform}
        templates={templates}
        backgroundImage={backgroundImage}
        textElements={textElements}
        bannerElements={bannerElements}
        userImages={userImages}
        isGeneratingImage={isGeneratingImage}
        isUploading={isUploading}
        onTemplateSelect={handleTemplateSelect}
        onGoToExport={handleGoToExport}
        onUpdateTextElement={updateTextElement}
        onGenerateAIImage={generateAIImage}
        onRegenerateImage={handleRegenerateImage}
        onGenerateAIText={generateAIText}
        onUploadImage={uploadImage}
        onSelectUserImage={selectUserImage}
        onUpdateBannerElements={setBannerElements}
        onBack={handleBackToEditor}
      />
    </div>
  );
};

export default SmartBannerBuilder;
