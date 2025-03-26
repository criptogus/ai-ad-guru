
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import InstagramTemplateGallery, { InstagramTemplate } from "../instagram/InstagramTemplateGallery";

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
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyInfo.companyName}
                onChange={(e) => onCompanyNameChange(e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={testAd.headline || ""}
                onChange={(e) => onAdChange("headline", e.target.value)}
                placeholder="Enter headline (150 characters max)"
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryText">Primary Text</Label>
              <Textarea
                id="primaryText"
                value={testAd.primaryText || ""}
                onChange={(e) => onAdChange("primaryText", e.target.value)}
                placeholder="Enter primary ad text (600 characters max)"
                maxLength={600}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description / CTA</Label>
              <Input
                id="description"
                value={testAd.description || ""}
                onChange={(e) => onAdChange("description", e.target.value)}
                placeholder="Enter description or call to action (150 characters max)"
                maxLength={150}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={onIndustryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Ad Theme</Label>
              <Select value={adTheme} onValueChange={onAdThemeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Innovation & Technology">Innovation & Technology</SelectItem>
                  <SelectItem value="Professional & Corporate">Professional & Corporate</SelectItem>
                  <SelectItem value="Trustworthy & Reliable">Trustworthy & Reliable</SelectItem>
                  <SelectItem value="Growth & Success">Growth & Success</SelectItem>
                  <SelectItem value="Leadership & Vision">Leadership & Vision</SelectItem>
                  <SelectItem value="Team & Collaboration">Team & Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Image Format</Label>
              <Select value={imageFormat} onValueChange={onImageFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square (1:1)</SelectItem>
                  <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate ? (
              <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                <div>
                  <Label className="text-sm font-semibold">Selected Template</Label>
                  <p className="text-xs text-muted-foreground">{selectedTemplate.title}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mainText">Main Text</Label>
                  <Input
                    id="mainText"
                    value={mainText}
                    onChange={(e) => setMainText(e.target.value)}
                    placeholder="Enter main text for template"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="imagePrompt">Image Prompt</Label>
                <Textarea
                  id="imagePrompt"
                  value={testAd.imagePrompt || ""}
                  onChange={(e) => onAdChange("imagePrompt", e.target.value)}
                  placeholder="Describe the image you want to generate"
                  rows={3}
                />
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={handleGenerateWithTemplate}
                disabled={isGenerating || (!testAd.imagePrompt && !selectedTemplate)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Image"}
              </Button>
              <Button variant="outline" onClick={onReset}>
                Reset Form
              </Button>
            </div>
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
