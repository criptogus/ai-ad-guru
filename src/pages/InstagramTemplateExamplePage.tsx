
import React, { useState } from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { toast } from "sonner";
import { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";
import TemplateGallerySection from "@/components/instagram/templates/TemplateGallerySection";
import TemplateCustomizationForm from "@/components/instagram/templates/TemplateCustomizationForm";
import GeneratedImagePreview from "@/components/instagram/templates/GeneratedImagePreview";

const InstagramTemplateExamplePage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<InstagramTemplate | null>(null);
  const [mainText, setMainText] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { generateAdImage, isGenerating } = useImageGeneration();

  const handleSelectTemplate = (template: InstagramTemplate) => {
    setSelectedTemplate(template);
    
    // Extract default mainText from template
    const mainTextMatch = template.prompt.match(/\${mainText:([^}]*)}/);
    if (mainTextMatch && mainTextMatch[1]) {
      setMainText(mainTextMatch[1]);
    } else {
      setMainText("");
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    try {
      // Process the prompt by replacing variables with actual values
      let processedPrompt = selectedTemplate.prompt;
      if (mainText) {
        processedPrompt = processedPrompt.replace(/\${mainText:[^}]*}/g, mainText);
      }
      
      // Show credit usage information
      toast.info("Generating image will use 5 credits", {
        description: "This is a preview of how credits are used in the application"
      });
      
      // Generate the image
      const imageUrl = await generateAdImage(processedPrompt);
      
      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        toast.success("Instagram ad image generated", {
          description: "5 credits were used for this AI-powered image generation"
        });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setMainText("");
    setGeneratedImageUrl(null);
    toast.info("Selection reset");
  };

  return (
    <SafeAppLayout activePage="testing">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Instagram Template Example</h1>
          <p className="text-muted-foreground">
            This page demonstrates how to use the Instagram Template Gallery and Template Variables components together.
          </p>
        </div>

        <div className="space-y-6">
          {/* Template Gallery Section */}
          <TemplateGallerySection onSelectTemplate={handleSelectTemplate} />
          
          {/* Customization Form - Only shown when a template is selected */}
          {selectedTemplate && (
            <TemplateCustomizationForm
              selectedTemplate={selectedTemplate}
              mainText={mainText}
              setMainText={setMainText}
              isGenerating={isGenerating}
              onGenerateImage={handleGenerateImage}
              onReset={handleReset}
            />
          )}
          
          {/* Generated Image Preview - Only shown when an image has been generated */}
          {generatedImageUrl && (
            <GeneratedImagePreview
              generatedImageUrl={generatedImageUrl}
              selectedTemplate={selectedTemplate}
              mainText={mainText}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </SafeAppLayout>
  );
};

export default InstagramTemplateExamplePage;
