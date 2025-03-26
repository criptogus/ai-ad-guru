
import React, { useState } from "react";
import SafeAppLayout from "@/components/SafeAppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import InstagramTemplateGallery, { InstagramTemplate } from "@/components/testing/instagram/InstagramTemplateGallery";
import TemplateVariablesForm from "@/components/testing/meta/TemplateVariablesForm";
import { useImageGeneration } from "@/hooks/adGeneration/useImageGeneration";

const InstagramTemplateExamplePage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<InstagramTemplate | null>(null);
  const [mainText, setMainText] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("gallery");
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
    
    // Stay on the gallery tab after selection
    // We don't auto-switch tabs anymore to give users more space to browse templates
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
        // Automatically switch to preview tab after successful generation
        setActiveTab("preview");
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
    setActiveTab("gallery");
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full">
            <TabsTrigger value="gallery">Template Gallery</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedImageUrl}>Generated Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select a Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <InstagramTemplateGallery onSelectTemplate={handleSelectTemplate} />
                </CardContent>
              </Card>
              
              {selectedTemplate && (
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
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                        <Button
                          onClick={handleGenerateImage}
                          disabled={isGenerating}
                        >
                          {isGenerating ? "Generating..." : "Generate Image"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Generated Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {generatedImageUrl ? (
                      <div className="border rounded-md overflow-hidden">
                        <img
                          src={generatedImageUrl}
                          alt="Generated Instagram Ad"
                          className="w-full h-auto"
                        />
                      </div>
                    ) : (
                      <div className="h-80 bg-muted/20 flex items-center justify-center text-muted-foreground rounded-md">
                        No image generated yet
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Template Information</h3>
                        {selectedTemplate && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-medium">Template</p>
                              <p className="text-sm text-muted-foreground">{selectedTemplate.title}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Customization</p>
                              <p className="text-sm text-muted-foreground">{mainText || "[None]"}</p>
                            </div>
                            <div className="flex gap-3 pt-3">
                              <Button variant="outline" onClick={handleReset}>
                                Start Over
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SafeAppLayout>
  );
};

export default InstagramTemplateExamplePage;
