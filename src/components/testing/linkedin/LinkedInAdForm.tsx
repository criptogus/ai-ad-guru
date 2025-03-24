
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaAd } from "@/hooks/adGeneration";
import { WebsiteAnalysisResult } from "@/hooks/useWebsiteAnalysis";
import { Loader } from "lucide-react";

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
  onGenerateImage: () => void;
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
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={companyInfo.companyName}
          onChange={(e) => onCompanyNameChange(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="headline">Headline (150 chars max)</Label>
        <Input
          id="headline"
          value={testAd.headline}
          onChange={(e) => onAdChange('headline', e.target.value)}
          maxLength={150}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {testAd.headline.length}/150 characters
        </div>
      </div>
      
      <div>
        <Label htmlFor="primaryText">Primary Text (600 chars max)</Label>
        <Textarea
          id="primaryText"
          value={testAd.primaryText}
          onChange={(e) => onAdChange('primaryText', e.target.value)}
          maxLength={600}
          rows={4}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {testAd.primaryText.length}/600 characters
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description/CTA (150 chars max)</Label>
        <Input
          id="description"
          value={testAd.description}
          onChange={(e) => onAdChange('description', e.target.value)}
          maxLength={150}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {testAd.description.length}/150 characters
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select value={industry} onValueChange={onIndustryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Financial Services">Financial Services</SelectItem>
            <SelectItem value="Healthcare">Healthcare</SelectItem>
            <SelectItem value="Marketing">Marketing & Advertising</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Consulting">Consulting</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="adTheme">Ad Theme</Label>
        <Select value={adTheme} onValueChange={onAdThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select ad theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Innovation & Technology">Innovation & Technology</SelectItem>
            <SelectItem value="Professional Services">Professional Services</SelectItem>
            <SelectItem value="Business Growth">Business Growth</SelectItem>
            <SelectItem value="Thought Leadership">Thought Leadership</SelectItem>
            <SelectItem value="Networking & Connections">Networking & Connections</SelectItem>
            <SelectItem value="Industry Insights">Industry Insights</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageFormat">Image Format</Label>
        <Select value={imageFormat} onValueChange={onImageFormatChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select image format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="square">Square (1080x1080)</SelectItem>
            <SelectItem value="landscape">Landscape (1200x627)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="imagePrompt">Image Prompt</Label>
        <Textarea
          id="imagePrompt"
          value={testAd.imagePrompt}
          onChange={(e) => onAdChange('imagePrompt', e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button onClick={onGenerateImage} disabled={isGenerating} className="flex-1">
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate LinkedIn Image"
          )}
        </Button>
        <Button onClick={onReset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default LinkedInAdForm;
