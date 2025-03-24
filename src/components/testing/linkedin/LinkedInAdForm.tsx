
import React, { useState } from "react";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

interface LinkedInAdFormProps {
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

const LinkedInAdForm: React.FC<LinkedInAdFormProps> = ({
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
  const [activeTab, setActiveTab] = useState<string>("content");

  const promptTemplates = [
    {
      name: "Tech Innovation",
      prompt: "A sleek, futuristic device or interface in a minimalist setting, conveying innovation and cutting-edge technology"
    },
    {
      name: "Professional Success",
      prompt: "A confident professional in a modern workspace with subtle elements of success and achievement"
    },
    {
      name: "Business Growth",
      prompt: "Abstract visualization of business growth with upward trends, expanding elements, and professional aesthetics"
    },
    {
      name: "Team Collaboration",
      prompt: "Diverse team in a modern office environment collaborating effectively with visible synergy and productivity"
    },
    {
      name: "Premium Service",
      prompt: "High-end representation of professional service with dramatic lighting and premium atmosphere"
    }
  ];

  const handlePromptTemplate = (prompt: string) => {
    onAdChange('imagePrompt', prompt);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="content">Ad Content</TabsTrigger>
          <TabsTrigger value="image">Image Generation</TabsTrigger>
          <TabsTrigger value="settings">Company Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input 
              id="headline" 
              value={testAd.headline || ''} 
              onChange={(e) => onAdChange('headline', e.target.value)}
              placeholder="e.g., Accelerate Your Business Growth"
            />
          </div>
          
          <div>
            <Label htmlFor="primaryText">Primary Text</Label>
            <Textarea 
              id="primaryText" 
              value={testAd.primaryText || ''}
              onChange={(e) => onAdChange('primaryText', e.target.value)}
              placeholder="e.g., Discover how our solution can transform your business operations..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description / CTA</Label>
            <Input 
              id="description" 
              value={testAd.description || ''} 
              onChange={(e) => onAdChange('description', e.target.value)}
              placeholder="e.g., Learn More | Contact Us | Schedule Demo"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <div>
            <Label htmlFor="imagePrompt">Image Prompt</Label>
            <Textarea 
              id="imagePrompt" 
              value={testAd.imagePrompt || ''}
              onChange={(e) => onAdChange('imagePrompt', e.target.value)}
              placeholder="Describe the image you want to generate..."
              rows={5}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Detailed descriptions produce better results. Focus on setting, mood, colors, and style.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm">Quick Prompt Templates</Label>
            <div className="grid grid-cols-1 gap-2">
              {promptTemplates.map((template, idx) => (
                <Button 
                  key={idx} 
                  variant="outline" 
                  size="sm" 
                  className="justify-start h-auto py-2 px-3 text-left"
                  onClick={() => handlePromptTemplate(template.prompt)}
                >
                  <div>
                    <p className="font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {template.prompt}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="adTheme">Ad Theme</Label>
              <Select value={adTheme} onValueChange={onAdThemeChange}>
                <SelectTrigger id="adTheme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Innovation & Technology">Innovation & Technology</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Collaboration">Collaboration</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="imageFormat">Image Format</Label>
              <Select value={imageFormat} onValueChange={onImageFormatChange}>
                <SelectTrigger id="imageFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square (1:1)</SelectItem>
                  <SelectItem value="landscape">Landscape (1.91:1)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={onGenerateImage} 
            disabled={isGenerating || !testAd.imagePrompt}
            className="w-full group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Generating Image...' : 'Generate LinkedIn Ad Image'}
            </span>
          </Button>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              value={companyInfo.companyName} 
              onChange={(e) => onCompanyNameChange(e.target.value)}
              placeholder="e.g., Acme Corporation"
            />
          </div>
          
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select value={industry} onValueChange={onIndustryChange}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="Retail">Retail</SelectItem>
                <SelectItem value="Professional Services">Professional Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" onClick={onReset}>
            Reset to Defaults
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkedInAdForm;
