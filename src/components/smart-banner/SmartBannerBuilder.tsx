
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateSelection from "./TemplateSelection";
import BannerEditor from "./BannerEditor";
import BannerPreview from "./BannerPreview";
import ExportOptions from "./ExportOptions";
import { useBannerTemplate } from "@/hooks/smart-banner/useBannerTemplate";
import { useBannerEditor } from "@/hooks/smart-banner/useBannerEditor";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

export type BannerFormat = "square" | "horizontal" | "story";
export type BannerPlatform = "instagram" | "linkedin" | "google";

export interface BannerTemplate {
  id: string;
  name: string;
  description: string;
  type: "product" | "seasonal" | "event" | "brand" | "discount";
  previewImageUrl: string;
}

const SmartBannerBuilder: React.FC = () => {
  const navigate = useNavigate();
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
    isUploading
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

  const handleBackToCampaigns = () => {
    navigate("/campaigns");
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Banner Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create professional ad banners with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBackToCampaigns}>
            Back to Campaigns
          </Button>
          <Button className="gap-1" onClick={() => toast.info("Smart Banner Builder Beta", { description: "This feature is in beta. 8 credits will be used per banner generation." })}>
            <Sparkles size={16} />
            Beta
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Banner Settings</CardTitle>
          <CardDescription>
            Choose the platform and format for your ad banner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Select Platform</h3>
              <Tabs 
                defaultValue={selectedPlatform} 
                onValueChange={(value) => handlePlatformChange(value as BannerPlatform)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="instagram">Instagram</TabsTrigger>
                  <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                  <TabsTrigger value="google">Google Ads</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <h3 className="font-medium mb-3">Select Format</h3>
              <Tabs 
                defaultValue={selectedFormat} 
                onValueChange={(value) => handleFormatChange(value as BannerFormat)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="square">Square</TabsTrigger>
                  <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                  <TabsTrigger value="story">Story/Vertical</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentStep === "template" && (
        <TemplateSelection 
          templates={templates} 
          onSelectTemplate={handleTemplateSelect} 
        />
      )}

      {currentStep === "editor" && selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BannerEditor 
              template={selectedTemplate}
              format={selectedFormat}
              platform={selectedPlatform}
              backgroundImage={backgroundImage}
              textElements={textElements}
              onUpdateTextElement={updateTextElement}
              onGenerateAIImage={generateAIImage}
              onRegenerateImage={regenerateImage}
              onGenerateAIText={generateAIText}
              onUploadImage={uploadImage}
              isGeneratingImage={isGeneratingImage}
              isUploading={isUploading}
              onGoToExport={handleGoToExport}
              bannerElements={bannerElements}
              onUpdateBannerElements={setBannerElements}
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
      )}

      {currentStep === "export" && (
        <ExportOptions 
          format={selectedFormat}
          platform={selectedPlatform}
          backgroundImage={backgroundImage}
          textElements={textElements}
          bannerElements={bannerElements}
          onBack={() => setCurrentStep("editor")}
        />
      )}
    </div>
  );
};

export default SmartBannerBuilder;
