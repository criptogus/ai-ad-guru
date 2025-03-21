
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Image, 
  Type, 
  Sparkles, 
  Upload, 
  RefreshCw, 
  Palette, 
  Layers, 
  MoveRight 
} from "lucide-react";
import { BannerFormat, BannerPlatform, BannerTemplate } from "./SmartBannerBuilder";
import { Slider } from "@/components/ui/slider";
import { BannerElement, TextElement } from "@/hooks/smart-banner/useBannerEditor";
import ImagePromptForm from "./ImagePromptForm";
import TextPromptForm from "./TextPromptForm";
import ElementList from "./ElementList";
import ColorPicker from "./ColorPicker";

interface BannerEditorProps {
  template: BannerTemplate;
  format: BannerFormat;
  platform: BannerPlatform;
  backgroundImage: string | null;
  textElements: TextElement[];
  bannerElements: BannerElement[];
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onGenerateAIImage: (prompt: string) => Promise<void>;
  onRegenerateImage: () => Promise<void>;
  onGenerateAIText: (elementId: string, type: "headline" | "subheadline" | "cta") => Promise<void>;
  onUploadImage: (file: File) => Promise<void>;
  isGeneratingImage: boolean;
  isUploading: boolean;
  onGoToExport: () => void;
  onUpdateBannerElements: (elements: BannerElement[]) => void;
}

const BannerEditor: React.FC<BannerEditorProps> = ({
  template,
  format,
  platform,
  backgroundImage,
  textElements,
  bannerElements,
  onUpdateTextElement,
  onGenerateAIImage,
  onRegenerateImage,
  onGenerateAIText,
  onUploadImage,
  isGeneratingImage,
  isUploading,
  onGoToExport,
  onUpdateBannerElements
}) => {
  const [activeTab, setActiveTab] = useState("image");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const selectedElement = selectedElementId 
    ? bannerElements.find(el => el.id === selectedElementId) 
    : null;

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const updateElementProperty = (property: string, value: any) => {
    if (!selectedElementId) return;
    
    const updatedElements = bannerElements.map(el => {
      if (el.id === selectedElementId) {
        return { ...el, [property]: value };
      }
      return el;
    });
    
    onUpdateBannerElements(updatedElements);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Editor</CardTitle>
          <CardDescription>
            Customize your "{template.name}" banner for {platform} ({format})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="image" className="flex items-center gap-2">
                <Image size={16} /> Background
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type size={16} /> Text
              </TabsTrigger>
              <TabsTrigger value="elements" className="flex items-center gap-2">
                <Layers size={16} /> Elements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="image" className="space-y-4">
              {!backgroundImage ? (
                <div className="space-y-4">
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    <div>
                      <ImagePromptForm 
                        template={template} 
                        platform={platform}
                        format={format}
                        onSubmit={onGenerateAIImage}
                        isGenerating={isGeneratingImage}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="border rounded-md p-4">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <Upload size={16} /> Upload Your Own Image
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload your own image to use as the banner background
                        </p>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleTriggerFileInput}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <RefreshCw size={16} className="mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>Choose Image</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video relative overflow-hidden rounded-md bg-gray-100 max-h-[300px]">
                    <img
                      src={backgroundImage}
                      alt="Banner Background"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={onRegenerateImage}
                      disabled={isGeneratingImage}
                      className="flex items-center gap-2"
                    >
                      {isGeneratingImage ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <RefreshCw size={16} />
                      )}
                      Regenerate Image
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleTriggerFileInput}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>Upload New Image</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <TextPromptForm 
                textElements={textElements}
                onUpdateTextElement={onUpdateTextElement}
                onGenerateAIText={onGenerateAIText}
              />
            </TabsContent>

            <TabsContent value="elements" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ElementList 
                    elements={bannerElements}
                    onUpdateElements={onUpdateBannerElements}
                    selectedElementId={selectedElementId}
                    onSelectElement={setSelectedElementId}
                  />
                </div>
                <div>
                  {selectedElement ? (
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Element Properties</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Position X</Label>
                          <Slider 
                            value={[selectedElement.x]} 
                            min={0} 
                            max={100} 
                            step={1}
                            onValueChange={(value) => updateElementProperty('x', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Left</span>
                            <span>Right</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Position Y</Label>
                          <Slider 
                            value={[selectedElement.y]} 
                            min={0} 
                            max={100} 
                            step={1}
                            onValueChange={(value) => updateElementProperty('y', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Top</span>
                            <span>Bottom</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Scale</Label>
                          <Slider 
                            value={[selectedElement.scale || 100]} 
                            min={50} 
                            max={200} 
                            step={1}
                            onValueChange={(value) => updateElementProperty('scale', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>50%</span>
                            <span>200%</span>
                          </div>
                        </div>
                        
                        {selectedElement.type === 'text' && (
                          <>
                            <div className="space-y-2">
                              <Label>Font Size</Label>
                              <Slider 
                                value={[selectedElement.fontSize || 16]} 
                                min={12} 
                                max={72} 
                                step={1}
                                onValueChange={(value) => updateElementProperty('fontSize', value[0])}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Text Color</Label>
                              <ColorPicker 
                                color={selectedElement.color || '#000000'} 
                                onChange={(color) => updateElementProperty('color', color)}
                              />
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center justify-center h-full border rounded-md p-6">
                      <div className="text-center text-muted-foreground">
                        <Layers className="mx-auto h-12 w-12 opacity-20" />
                        <p className="mt-2">Select an element to edit its properties</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "image" ? "text" : activeTab === "text" ? "elements" : "image")}>
            {activeTab === "image" ? "Next: Text" : activeTab === "text" ? "Next: Elements" : "Back to Image"}
          </Button>
          <Button onClick={onGoToExport} className="gap-1">
            Continue to Export <MoveRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BannerEditor;
